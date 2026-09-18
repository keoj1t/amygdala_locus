import { NextRequest, NextResponse } from "next/server";
import { executeParallelSearch } from "@/lib/services/search";
import { deduplicateImages } from "@/lib/services/dedup";
import { verifyAndCategorizeImages } from "@/lib/services/ai-vision";
import { generateCampusSummary } from "@/lib/services/summary";
import { CampusProfile, CategoryType } from "@/types/campus";

// Runtime LRU Cache configuration (TTL: 15 minutes)
const profileCache = new Map<string, { data: CampusProfile; timestamp: number }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { universityName, apiKeys } = body;

    if (!universityName || typeof universityName !== "string" || !universityName.trim()) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите название университета." },
        { status: 400 }
      );
    }

    const trimmedName = universityName.trim();
    const cacheKey = trimmedName.toLowerCase();

    // Check Runtime Cache
    if (profileCache.has(cacheKey)) {
      const cached = profileCache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return NextResponse.json(cached.data);
      } else {
        profileCache.delete(cacheKey); // Expired
      }
    }

    // STEP 1 & 2: Query Expansion + Parallel Search Across All Categories
    const rawImages = await executeParallelSearch(trimmedName, {
      googleApiKey: apiKeys?.googleApiKey || process.env.GOOGLE_SEARCH_API_KEY,
      googleCx: apiKeys?.googleCx || process.env.GOOGLE_SEARCH_CX
    });

    // STEP 3: Deduplication (URL & Perceptual Hash distance)
    const { uniqueImages, duplicatesRemoved } = deduplicateImages(rawImages);

    // STEP 4: AI Vision Verification & Categorization
    const verifiedImages = await verifyAndCategorizeImages(uniqueImages, trimmedName, {
      geminiApiKey: apiKeys?.geminiApiKey || process.env.GEMINI_API_KEY,
      openaiApiKey: apiKeys?.openaiApiKey || process.env.OPENAI_API_KEY
    });

    // STEP 5: Infrastructure Summary & Metrics Calculation
    const { summary, keyHighlights, meta } = await generateCampusSummary(trimmedName, verifiedImages);

    // Calculate metrics
    const totalImages = verifiedImages.length;
    const avgTrustScore =
      totalImages > 0
        ? Math.round(
            verifiedImages.reduce((sum, img) => sum + img.trustScore, 0) / totalImages
          )
        : 0;

    const categoryBreakdown: Record<CategoryType, number> = {
      campus: 0,
      dorm: 0,
      lab: 0,
      sport: 0,
      city: 0,
      student_life: 0
    };

    for (const img of verifiedImages) {
      if (categoryBreakdown[img.category] !== undefined) {
        categoryBreakdown[img.category]++;
      }
    }

    const executionTimeMs = Date.now() - startTime;

    const hasLiveKeys = Boolean(
      apiKeys?.googleApiKey || process.env.GOOGLE_SEARCH_API_KEY ||
      apiKeys?.geminiApiKey || process.env.GEMINI_API_KEY ||
      apiKeys?.openaiApiKey || process.env.OPENAI_API_KEY ||
      apiKeys?.serperApiKey || process.env.SERPER_API_KEY ||
      process.env.GROQ_API_KEY
    );

    const profile: CampusProfile = {
      university: meta,
      summary,
      keyHighlights,
      overallTrustScore: avgTrustScore,
      totalImages,
      images: verifiedImages,
      categoryBreakdown,
      generatedAt: new Date().toISOString(),
      executionTimeMs,
      isMockData: !hasLiveKeys
    };

    // Save to Cache
    profileCache.set(cacheKey, { data: profile, timestamp: Date.now() });

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return NextResponse.json(
      { error: "Ошибка при генерации профиля кампуса: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

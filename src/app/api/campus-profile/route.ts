import { NextRequest, NextResponse } from "next/server";
import { executeParallelSearch } from "@/lib/services/search";
import { deduplicateImages } from "@/lib/services/dedup";
import { verifyAndCategorizeImages } from "@/lib/services/ai-vision";
import { generateCampusSummary } from "@/lib/services/summary";
import { CampusProfile, CategoryType } from "@/types/campus";

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    const body = await req.json();
    const { universityName, apiKeys } = body;

    if (!universityName || typeof universityName !== "string") {
      return NextResponse.json(
        { error: "Пожалуйста, укажите название университета." },
        { status: 400 }
      );
    }

    const trimmedName = universityName.trim();

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
    const { summary, keyHighlights, meta } = generateCampusSummary(trimmedName, verifiedImages);

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
      isMockData: !apiKeys?.googleApiKey && !apiKeys?.geminiApiKey && !apiKeys?.openaiApiKey
    };

    return NextResponse.json(profile);
  } catch (error: any) {
    console.error("Pipeline Error:", error);
    return NextResponse.json(
      { error: "Ошибка при генерации профиля кампуса: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}

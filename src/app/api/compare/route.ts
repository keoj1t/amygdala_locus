import { NextRequest, NextResponse } from "next/server";
import { executeParallelSearch } from "@/lib/services/search";
import { deduplicateImages } from "@/lib/services/dedup";
import { verifyAndCategorizeImages } from "@/lib/services/ai-vision";
import { generateCampusSummary } from "@/lib/services/summary";
import { CampusProfile, ComparisonResult } from "@/types/campus";

async function buildProfile(name: string, apiKeys?: any): Promise<CampusProfile> {
  const startTime = Date.now();
  const rawImages = await executeParallelSearch(name, {
    googleApiKey: apiKeys?.googleApiKey || process.env.GOOGLE_SEARCH_API_KEY,
    googleCx: apiKeys?.googleCx || process.env.GOOGLE_SEARCH_CX
  });
  const { uniqueImages } = deduplicateImages(rawImages);
  const verifiedImages = await verifyAndCategorizeImages(uniqueImages, name, {
    geminiApiKey: apiKeys?.geminiApiKey || process.env.GEMINI_API_KEY,
    openaiApiKey: apiKeys?.openaiApiKey || process.env.OPENAI_API_KEY
  });
  const { summary, keyHighlights, meta } = await generateCampusSummary(name, verifiedImages);

  const totalImages = verifiedImages.length;
  const avgTrustScore =
    totalImages > 0
      ? Math.round(
          verifiedImages.reduce((sum, img) => sum + img.trustScore, 0) / totalImages
        )
      : 0;

  const categoryBreakdown: any = {
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

  return {
    university: meta,
    summary,
    keyHighlights,
    overallTrustScore: avgTrustScore,
    totalImages,
    images: verifiedImages,
    categoryBreakdown,
    generatedAt: new Date().toISOString(),
    executionTimeMs: Date.now() - startTime,
    isMockData: !apiKeys?.geminiApiKey && !apiKeys?.googleApiKey
  };
}

export async function POST(req: NextRequest) {
  try {
    const { universityA, universityB, apiKeys } = await req.json();

    if (!universityA || !universityB) {
      return NextResponse.json(
        { error: "Необходимо указать оба университета для сравнения." },
        { status: 400 }
      );
    }

    // Parallel profile generation
    const [profileA, profileB] = await Promise.all([
      buildProfile(universityA, apiKeys),
      buildProfile(universityB, apiKeys)
    ]);

    const scoreDiff = profileA.overallTrustScore - profileB.overallTrustScore;

    const dormWinner =
      (profileA.categoryBreakdown.dorm || 0) > (profileB.categoryBreakdown.dorm || 0)
        ? "A"
        : (profileB.categoryBreakdown.dorm || 0) > (profileA.categoryBreakdown.dorm || 0)
        ? "B"
        : "Tie";

    const infraWinner =
      profileA.images.length > profileB.images.length
        ? "A"
        : profileB.images.length > profileA.images.length
        ? "B"
        : "Tie";

    const nameA = profileA.university.universityName || profileA.university.name || "Университет А";
    const nameB = profileB.university.universityName || profileB.university.name || "Университет Б";

    let verdict = "";
    if (scoreDiff > 5) {
      verdict = `${nameA} имеет более высокий уровень подтвержденных данных (+${scoreDiff}% Trust Score) и более подробную визуализацию кампуса.`;
    } else if (scoreDiff < -5) {
      verdict = `${nameB} лидирует по уровню доверия к источникам (+${Math.abs(scoreDiff)}% Trust Score).`;
    } else {
      verdict = `Оба университета демонстрируют сопоставимо высокое качество инфраструктуры и проверенную базу фотоматериалов.`;
    }

    const comparison: ComparisonResult = {
      universityA: profileA,
      universityB: profileB,
      scoreDifference: scoreDiff,
      dormComparison: {
        winner: dormWinner,
        details: `${nameA}: ${profileA.categoryBreakdown.dorm || 0} фото общежитий vs ${nameB}: ${profileB.categoryBreakdown.dorm || 0} фото.`
      },
      infraComparison: {
        winner: infraWinner,
        details: `Лаборатории и спорткомплексы представлены в обоих профилях с детальными фотоматериалами.`
      },
      verdict
    };

    return NextResponse.json(comparison);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

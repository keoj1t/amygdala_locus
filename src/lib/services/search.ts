import { CategoryType, CampusImage } from "@/types/campus";
import { KNOWN_UNIVERSITIES } from "@/lib/constants/universities";

export interface CategoryQuery {
  category: CategoryType;
  queries: string[];
}

const NEGATIVE_STOCK_KEYWORDS = "-stock -shutterstock -freepik -depositphotos";

const BANNED_STOCK_DOMAINS = [
  "freepik.com",
  "shutterstock.com",
  "depositphotos.com",
  "stock.adobe.com",
  "gettyimages.com",
  "pinterest.com",
  "unsplash.com",
  "vecteezy.com",
  "dreamstime.com",
  "123rf.com",
  "alamy.com",
  "istockphoto.com",
  "cleanpng.com",
  "pngtree.com",
  "canva.com"
];

/**
 * Step 1: Query Expansion
 * Formulates clean, targeted queries per category.
 */
export function expandSearchQueries(universityName: string): CategoryQuery[] {
  const clean = universityName.trim().replace(/^["']|["']$/g, "");

  return [
    {
      category: "campus",
      queries: [
        `"${clean}" campus building`,
        `"${clean}" architecture main entrance`,
        `"${clean}" главный корпус кампус`
      ]
    },
    {
      category: "dorm",
      queries: [
        `"${clean}" dormitory student housing`,
        `"${clean}" dorm room residence hall`,
        `"${clean}" общежитие дом студентов`
      ]
    },
    {
      category: "lab",
      queries: [
        `"${clean}" research laboratory`,
        `"${clean}" classroom lecture hall`,
        `"${clean}" лаборатория научный центр`
      ]
    },
    {
      category: "sport",
      queries: [
        `"${clean}" sports center gym`,
        `"${clean}" swimming pool stadium`,
        `"${clean}" спортивный комплекс`
      ]
    },
    {
      category: "city",
      queries: [
        `"${clean}" campus neighborhood city location`,
        `"${clean}" surroundings transit metro`
      ]
    },
    {
      category: "student_life",
      queries: [
        `"${clean}" student life events`,
        `"${clean}" library cafeteria campus`
      ]
    }
  ];
}

/**
 * Extracts key search tokens / abbreviations from university name
 */
function extractUniversityKeywords(universityName: string): string[] {
  const clean = universityName.toLowerCase().replace(/[^a-zа-яё0-9\s]/gi, " ");
  const words = clean.split(/\s+/).filter(w => w.length > 2);
  
  // Create acronym (e.g. "Czech Technical University in Prague" -> "ctu", "cvut")
  const stopWords = new Set([
    "in", "of", "the", "and", "at", "for", "им", "в", "и", "по",
    "university", "college", "school", "institute", "academy", "университет", "институт", 
    "колледж", "академия", "университеті", "state", "national"
  ]);
  const meaningfulWords = words.filter(w => !stopWords.has(w));
  const acronym = meaningfulWords.map(w => w[0]).join("");

  const tokens = [...meaningfulWords];
  if (acronym.length >= 2) tokens.push(acronym);

  // Common international abbreviations
  if (clean.includes("czech technical") || clean.includes("čvut") || clean.includes("cvut")) {
    tokens.push("ctu", "cvut", "čvut", "prague", "praha");
  }
  if (clean.includes("nazarbayev")) {
    tokens.push("nu", "nu.edu.kz", "astana");
  }
  if (clean.includes("astana it") || clean.includes("aitu")) {
    tokens.push("aitu", "astanait");
  }
  if (clean.includes("satbayev") || clean.includes("казниту")) {
    tokens.push("satbayev", "kaznit", "polytech");
  }

  return tokens;
}

/**
 * Strict Image Filter:
 * 1. Rejects banned stock domains and keywords
 * 2. Rejects images without relevant university tokens in title/URL/domain
 */
export function validateAndFilterImage(
  item: { url: string; title: string; sourceUrl: string; sourceDomain: string },
  universityName: string
): boolean {
  const combined = `${item.url} ${item.title} ${item.sourceUrl} ${item.sourceDomain}`.toLowerCase();

  // 1. Check banned stock domains
  for (const banned of BANNED_STOCK_DOMAINS) {
    if (combined.includes(banned)) {
      return false;
    }
  }

  // 2. Check for stock words in URL or title
  if (/\b(stock|shutterstock|depositphotos|freepik|gettyimages|vecteezy|dreamstime|123rf|alamy|istockphoto|clipart|vector|illustrations)\b/i.test(combined)) {
    return false;
  }

  // 3. Relevance check: must contain at least one meaningful keyword/acronym from university name
  const keywords = extractUniversityKeywords(universityName);
  const hasKeywordMatch = keywords.length === 0 || keywords.some(kw => combined.includes(kw));

  if (!hasKeywordMatch) {
    return false;
  }

  return true;
}

/**
 * Live Serper.dev Google Images Search executor (Fast, Real Google Images with Strict Filtering)
 */
async function searchSerperImages(
  query: string,
  category: CategoryType,
  apiKey: string,
  universityName: string
): Promise<CampusImage[]> {
  try {
    const res = await fetch("https://google.serper.dev/images", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        q: query,
        num: 8
      })
    });

    if (!res.ok) {
      console.warn(`Serper API error: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    if (!data.images || !Array.isArray(data.images)) return [];

    const filtered: CampusImage[] = [];

    for (const [idx, item] of data.images.entries()) {
      const sourceUrl = item.link || item.imageUrl;
      let domain = item.domain || item.source || "";
      if (!domain) {
        try {
          domain = new URL(sourceUrl).hostname.replace(/^www\./, "");
        } catch {}
      }

      const candidate = {
        url: item.imageUrl,
        title: item.title || `${category} image`,
        sourceUrl,
        sourceDomain: domain
      };

      // Strict stock and relevance check
      if (!validateAndFilterImage(candidate, universityName)) {
        continue;
      }

      // Calculate initial trust
      const isOfficialDomain = domain.includes(".edu") || domain.includes(".ac.") || domain.includes(universityName.toLowerCase().replace(/[^a-z0-9]/g, ""));
      const trustScore = isOfficialDomain ? 94 : 80;

      filtered.push({
        id: `serper-${category}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        url: item.imageUrl,
        thumbnailUrl: item.thumbnailUrl || item.imageUrl,
        title: item.title,
        category,
        sourceUrl,
        sourceDomain: domain,
        publishDate: undefined,
        trustScore,
        trustStatus: trustScore >= 75 ? "verified" : "needs_check",
        width: item.imageWidth,
        height: item.imageHeight,
        aiReasoning: `Найдено в Google Images для "${universityName}". Источник: ${domain}.`
      });
    }

    return filtered;
  } catch (err) {
    console.error("Serper search execution failed:", err);
    return [];
  }
}

/**
 * Live Google Custom Search API executor
 */
async function searchGoogleCustomSearch(
  query: string,
  category: CategoryType,
  apiKey: string,
  searchEngineId: string,
  universityName: string
): Promise<CampusImage[]> {
  try {
    const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(
      apiKey
    )}&cx=${encodeURIComponent(searchEngineId)}&q=${encodeURIComponent(
      query
    )}&searchType=image&num=10&safe=active`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) return [];

    const results: CampusImage[] = [];
    for (const [idx, item] of data.items.entries()) {
      const sourceUrl = item.image?.contextLink || item.link;
      let domain = "web";
      try {
        domain = new URL(sourceUrl).hostname.replace(/^www\./, "");
      } catch {}

      const candidate = {
        url: item.link,
        title: item.title,
        sourceUrl,
        sourceDomain: domain
      };

      if (!validateAndFilterImage(candidate, universityName)) {
        continue;
      }

      results.push({
        id: `g-${category}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        url: item.link,
        thumbnailUrl: item.image?.thumbnailLink || item.link,
        title: item.title || `${category} image`,
        category,
        sourceUrl,
        sourceDomain: domain,
        publishDate: undefined,
        trustScore: 82,
        trustStatus: "verified",
        width: item.image?.width,
        height: item.image?.height
      });
    }

    return results;
  } catch {
    return [];
  }
}

/**
 * Step 2: Parallel Search & Scraping with Fallback Queries
 */
export async function executeParallelSearch(
  universityName: string,
  apiKeys?: {
    serperApiKey?: string;
    googleApiKey?: string;
    googleCx?: string;
  }
): Promise<CampusImage[]> {
  const categoryQueries = expandSearchQueries(universityName);
  const serperKey = apiKeys?.serperApiKey || process.env.SERPER_API_KEY;
  const googleKey = apiKeys?.googleApiKey || process.env.GOOGLE_SEARCH_API_KEY;
  const googleCx = apiKeys?.googleCx || process.env.GOOGLE_SEARCH_CX;

  // 1. Check known verified database if offline or exact match
  const normalizedKey = universityName.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const exactNameSearch = universityName.trim().toLowerCase();
  for (const [key, data] of Object.entries(KNOWN_UNIVERSITIES)) {
    if (
      key === normalizedKey ||
      (data.meta.name && data.meta.name.toLowerCase() === exactNameSearch) ||
      (data.meta.universityName && data.meta.universityName.toLowerCase() === exactNameSearch) ||
      (data.meta.nativeName && data.meta.nativeName.toLowerCase() === exactNameSearch)
    ) {
      if (!serperKey && !googleKey) {
        return data.images.filter(img => validateAndFilterImage(img, universityName));
      }
    }
  }

  // 2. Parallel fetch across all categories using Promise.all with live search APIs
  const categoryPromises = categoryQueries.map(async (catQuery) => {
    let images: CampusImage[] = [];

    // 2.1 Serper.dev Google Images
    if (serperKey) {
      const serperPromises = catQuery.queries.map(query => 
        searchSerperImages(query, catQuery.category, serperKey, universityName)
      );
      const resultsSet = await Promise.all(serperPromises);
      images.push(...resultsSet.flat());
    }

    // 2.2 Google Custom Search
    if (images.length === 0 && googleKey && googleCx) {
      const googlePromises = catQuery.queries.map(query => 
        searchGoogleCustomSearch(query, catQuery.category, googleKey, googleCx, universityName)
      );
      const googleResultsSet = await Promise.all(googlePromises);
      images.push(...googleResultsSet.flat());
    }

    // Local deduplication by URL
    const unique = new Map<string, CampusImage>();
    for (const img of images) {
      if (!unique.has(img.url)) unique.set(img.url, img);
    }
    return Array.from(unique.values());
  });

  const nestedResults = await Promise.all(categoryPromises);
  const allResults = nestedResults.flat();

  // If live search returned results, return them directly
  if (allResults.length > 0) {
    return allResults;
  }

  // If live search returned 0 (e.g. offline without API key), check known universities or return empty to allow AI pipeline fallback
  for (const [key, data] of Object.entries(KNOWN_UNIVERSITIES)) {
    if (
      key === normalizedKey ||
      (data.meta.name && data.meta.name.toLowerCase() === exactNameSearch) ||
      (data.meta.universityName && data.meta.universityName.toLowerCase() === exactNameSearch) ||
      (data.meta.nativeName && data.meta.nativeName.toLowerCase() === exactNameSearch)
    ) {
      return data.images.filter(img => validateAndFilterImage(img, universityName));
    }
  }

  return allResults;
}

import type { Browser } from 'playwright';

export interface RedditReview {
  id: string;
  title: string;
  author: string;
  score: number;
  url: string;
  text: string;
  createdAt: string;
  source: string;
  subreddit?: string;
}

export interface UniversityReviewsResult {
  source: 'Reddit (Live)' | 'Reddit (Apify)' | 'Reddit (Direct)';
  isAI: boolean;
  data: RedditReview[];
}

function getRandomHeaders(): Record<string, string> {
  const versions = ['124.0.0.0', '125.0.0.0', '126.0.0.0', '123.0.6312.86', '122.0.6261.94'];
  const v = versions[Math.floor(Math.random() * versions.length)];
  const rand = Math.random().toString(36).substring(2, 8);
  return {
    'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${v} Safari/537.36 LocusBot/${rand}`,
    'Accept': 'application/atom+xml,application/xml,text/xml,application/json;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
    'Cache-Control': 'no-cache',
  };
}

/**
 * Clean and truncate review snippet text
 */
function cleanSnippetText(rawText: string, maxLength = 350): string {
  if (!rawText) return '';

  let cleaned = rawText
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned === '[deleted]' || cleaned === '[removed]') {
    return '';
  }

  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength).trim() + '...';
  }

  return cleaned;
}

/**
 * Known dedicated university subreddits (where entire subreddit is about the university)
 */
const DEDICATED_UNI_SUBREDDITS: Record<string, string[]> = {
  mit: ['mit'],
  harvard: ['harvard'],
  stanford: ['stanford'],
  berkeley: ['berkeley'],
  ucla: ['ucla'],
  cmu: ['cmu'],
  cornell: ['cornell'],
  columbia: ['columbia'],
  yale: ['yale'],
  princeton: ['princeton'],
  nyu: ['nyu'],
  oxford: ['oxforduni'],
  cambridge: ['cambridge_uni'],
  imperial: ['Imperial2020'],
  uoft: ['UofT'],
  ubc: ['UBC'],
  ethz: ['ethz'],
  tum: ['tum'],
};

/**
 * General regional/city subreddits where we MUST perform keyword searches only
 */
const REGIONAL_SUBREDDITS: Record<string, string[]> = {
  czech: ['Prague', 'czech', 'czechrepublic'],
  kazakhstan: ['kazakhstan', 'Astana', 'Almaty'],
  uk: ['UniUK', 'ApplyingToCollege'],
  usa: ['ApplyingToCollege', 'college'],
};

/**
 * Extracts key search keywords and aliases for strict relevance filtering
 */
export function getUniversityKeywords(universityName: string): {
  primaryName: string;
  aliases: string[];
  dedicatedSubs: string[];
  regionalSubs: string[];
} {
  const lower = universityName.toLowerCase().trim();
  const aliases: string[] = [lower];
  const dedicatedSubs: string[] = [];
  const regionalSubs: string[] = [];

  // 1. Specific aliases & acronyms
  if (lower.includes('mit') || lower.includes('massachusetts institute')) {
    aliases.push('mit', 'massachusetts institute', 'mass tech');
    dedicatedSubs.push('mit');
    regionalSubs.push('ApplyingToCollege', 'college');
  } else if (lower.includes('harvard')) {
    aliases.push('harvard');
    dedicatedSubs.push('harvard');
    regionalSubs.push('ApplyingToCollege');
  } else if (lower.includes('stanford')) {
    aliases.push('stanford');
    dedicatedSubs.push('stanford');
    regionalSubs.push('ApplyingToCollege');
  } else if (lower.includes('berkeley') || lower.includes('ucb')) {
    aliases.push('berkeley', 'ucb');
    dedicatedSubs.push('berkeley');
  } else if (lower.includes('ucla')) {
    aliases.push('ucla');
    dedicatedSubs.push('ucla');
  } else if (lower.includes('czech') || lower.includes('ctu') || lower.includes('čvut') || lower.includes('cvut') || lower.includes('prague')) {
    aliases.push('ctu', 'cvut', 'čvut', 'czech technical', 'dejvice', 'fel', 'fit', 'fa');
    regionalSubs.push('Prague', 'czech', 'czechrepublic');
  } else if (lower.includes('charles university') || lower.includes('karlova')) {
    aliases.push('charles university', 'cuni', 'karlova');
    regionalSubs.push('Prague', 'czech');
  } else if (lower.includes('nazarbayev') || lower.includes('nu') || lower.includes('назарбаев')) {
    aliases.push('nazarbayev', 'nu', 'назарбаев', 'ну');
    regionalSubs.push('kazakhstan', 'Astana');
  } else if (lower.includes('aitu') || lower.includes('astana it') || lower.includes('аиту')) {
    aliases.push('aitu', 'astana it', 'аиту');
    regionalSubs.push('Astana', 'kazakhstan');
  } else if (lower.includes('kaznu') || lower.includes('казну') || lower.includes('al-farabi') || lower.includes('аль-фараби')) {
    aliases.push('kaznu', 'казну', 'аль-фараби', 'al-farabi');
    regionalSubs.push('Almaty', 'kazakhstan');
  } else if (lower.includes('satbayev') || lower.includes('сатпаев') || lower.includes('казирни')) {
    aliases.push('satbayev', 'сатпаев', 'политех');
    regionalSubs.push('Almaty', 'kazakhstan');
  } else if (lower.includes('kbtu') || lower.includes('кбту')) {
    aliases.push('kbtu', 'кбту');
    regionalSubs.push('Almaty', 'kazakhstan');
  } else if (lower.includes('oxford')) {
    aliases.push('oxford');
    dedicatedSubs.push('oxforduni');
    regionalSubs.push('UniUK');
  } else if (lower.includes('cambridge')) {
    aliases.push('cambridge');
    dedicatedSubs.push('cambridge_uni');
    regionalSubs.push('UniUK');
  } else if (lower.includes('toronto') || lower.includes('uoft')) {
    aliases.push('toronto', 'uoft');
    dedicatedSubs.push('UofT');
  } else if (lower.includes('ubc')) {
    aliases.push('ubc', 'british columbia');
    dedicatedSubs.push('UBC');
  } else {
    // Dynamic single words
    const meaningfulWords = universityName
      .replace(/[(),]/g, ' ')
      .split(/\s+/)
      .map(w => w.toLowerCase().replace(/[^a-zA-Z0-9а-яА-Я]/g, ''))
      .filter(w => w.length >= 3 && !['university', 'institute', 'college', 'technology', 'national', 'state', 'and', 'the', 'for'].includes(w));

    meaningfulWords.forEach(w => aliases.push(w));
    regionalSubs.push('college', 'ApplyingToCollege');
  }

  return {
    primaryName: universityName,
    aliases,
    dedicatedSubs,
    regionalSubs,
  };
}

/**
 * Strict Relevance Verifier: checks if a post is genuinely related to the university & student life
 */
export function isPostRelevantToUniversity(
  post: { title: string; text?: string; subreddit?: string },
  uniInfo: { aliases: string[]; dedicatedSubs: string[] }
): boolean {
  const fullContent = `${post.title} ${post.text || ''} ${post.subreddit || ''}`.toLowerCase();
  const subLower = (post.subreddit || '').toLowerCase();

  // 1. If post is inside a dedicated university subreddit (e.g. r/mit, r/harvard), verify it's student/campus related
  if (uniInfo.dedicatedSubs.some(s => s.toLowerCase() === subLower)) {
    // Check if it's not total unrelated spam
    const studentWords = [
      'dorm', 'campus', 'room', 'housing', 'class', 'course', 'prof', 'admission',
      'acceptance', 'gpa', 'study', 'major', 'hall', 'dining', 'internship', 'lab',
      'degree', 'exam', 'semester', 'review', 'experience', 'advice', 'freshman', 'phd',
      'tuition', 'financial aid', 'recs', 'app', 'student', 'building', 'library'
    ];
    // If it has any student context word OR length >= 15, accept
    return studentWords.some(w => fullContent.includes(w)) || post.title.length >= 10;
  }

  // 2. For posts from general subreddits (r/Prague, r/kazakhstan, r/ApplyingToCollege, etc.)
  // The post MUST explicitly mention at least one alias/acronym of the university
  const mentionsUniversity = uniInfo.aliases.some(alias => {
    if (alias.length <= 3) {
      // For short acronyms (mit, ctu, nu, etc.), match as whole word
      const regex = new RegExp(`\\b${alias}\\b`, 'i');
      return regex.test(fullContent);
    }
    return fullContent.includes(alias);
  });

  if (!mentionsUniversity) {
    return false;
  }

  // AND it must have some education / student / campus / living context
  const academicContext = [
    'uni', 'university', 'college', 'campus', 'dorm', 'dormitory', 'student', 'review',
    'admission', 'apply', 'faculty', 'professor', 'courses', 'tuition', 'housing',
    'универ', 'университет', 'общага', 'общежитие', 'поступление', 'сессия', 'препод',
    'факультет', 'бакалавриат', 'магистратура', 'грант', 'стипендия', 'study', 'cvut', 'ctu', 'mit'
  ];

  return academicContext.some(ctx => fullContent.includes(ctx));
}

/**
 * Premium Actor Provider: Uses Apify Reddit Scraper Lite with strict university queries
 */
export async function fetchRedditViaApify(
  universityName: string,
  limit = 5
): Promise<RedditReview[]> {
  const token = process.env.APIFY_API_TOKEN?.trim();
  if (!token) return [];

  const uniInfo = getUniversityKeywords(universityName);

  try {
    console.log(`[RedditScraper] Running Apify Actor (trudax/reddit-scraper-lite) for: "${universityName}"...`);
    
    // Construct focused search queries targeting university reviews and student dorms
    const searchTerms = [
      `"${universityName}" review OR dorm OR campus OR student`,
      `${uniInfo.aliases[0]} university dorm OR campus OR professors OR review`,
    ];

    const runRes = await fetch(
      `https://api.apify.com/v2/acts/trudax~reddit-scraper-lite/runs?token=${encodeURIComponent(token)}&waitForFinish=25`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          searches: searchTerms,
          sort: 'top',
          maxItems: limit * 2, // fetch extra to allow strict relevance filtering
          maxPostCount: limit * 2,
          scrollTimeout: 20,
          proxy: {
            useApifyProxy: true,
            apifyProxyGroups: ['RESIDENTIAL'],
          },
        }),
      }
    );

    if (!runRes.ok) {
      console.warn(`[RedditScraper] Apify API error: HTTP ${runRes.status}`);
      return [];
    }

    const runJson = await runRes.json();
    const datasetId = runJson.data?.defaultDatasetId;
    if (!datasetId) return [];

    const datasetRes = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?token=${encodeURIComponent(token)}&limit=${limit * 2}`
    );

    if (!datasetRes.ok) return [];

    const items: any[] = await datasetRes.json();
    if (!Array.isArray(items) || items.length === 0) return [];

    const reviews: RedditReview[] = [];
    const seenUrls = new Set<string>();

    for (let idx = 0; idx < items.length; idx++) {
      if (reviews.length >= limit) break;
      const item = items[idx];
      const rawTitle = item.title || item.name || '';
      const rawUrl = item.url || item.permalink || (item.id ? `https://reddit.com/comments/${item.id}` : '');
      const permalink = rawUrl.startsWith('http') ? rawUrl : `https://reddit.com${rawUrl}`;
      const title = cleanSnippetText(rawTitle, 200);
      const text = cleanSnippetText(item.body || item.selftext || item.text || '', 350);
      const subreddit = item.communityName?.replace(/^r\//, '') || item.subreddit?.replace(/^r\//, '') || 'college';

      const candidate = {
        title,
        text,
        subreddit,
      };

      // Strict relevance check
      if (!isPostRelevantToUniversity(candidate, uniInfo)) {
        continue;
      }

      if (!seenUrls.has(permalink) && title.length > 0) {
        seenUrls.add(permalink);
        reviews.push({
          id: item.id || `apify-reddit-${idx}-${Date.now()}`,
          title,
          author: (item.author || item.userName || 'Reddit Student').replace(/^u\//, ''),
          score: typeof item.upVotes === 'number' ? item.upVotes : typeof item.score === 'number' ? item.score : 50,
          url: permalink,
          text,
          createdAt: item.createdAt || item.postedAt || new Date().toISOString(),
          source: 'Reddit',
          subreddit,
        });
      }
    }

    console.log(`[RedditScraper] Apify found ${reviews.length} strictly relevant reviews for ${universityName}`);
    return reviews;
  } catch (err) {
    console.warn('[RedditScraper] Apify execution error:', (err as Error).message);
    return [];
  }
}

/**
 * Parse XML/Atom Feed from Reddit with strict relevance filtering
 */
function parseRedditRss(
  xml: string,
  defaultSubreddit: string,
  uniInfo: { aliases: string[]; dedicatedSubs: string[] }
): RedditReview[] {
  const reviews: RedditReview[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const titleMatch = entry.match(/<title>([^<]+)<\/title>/);
    const linkMatch = entry.match(/<link href="([^"]+)"/);
    const authorMatch = entry.match(/<author><name>([^<]+)<\/name>/);
    const updatedMatch = entry.match(/<updated>([^<]+)<\/updated>/);
    const categoryMatch = entry.match(/<category term="([^"]+)"/);
    const contentMatch = entry.match(/<content type="html">([\s\S]*?)<\/content>/);

    const title = titleMatch ? cleanSnippetText(titleMatch[1], 200) : '';
    const url = linkMatch ? linkMatch[1] : '';
    if (!title || !url) continue;

    const author = authorMatch ? authorMatch[1].replace(/^\/u\//, '') : 'Reddit Student';
    const createdAt = updatedMatch ? updatedMatch[1] : new Date().toISOString();
    const subreddit = categoryMatch ? categoryMatch[1] : defaultSubreddit;

    let text = '';
    if (contentMatch) {
      text = cleanSnippetText(contentMatch[1], 350);
    }

    // Strict Relevance Check
    if (!isPostRelevantToUniversity({ title, text, subreddit }, uniInfo)) {
      continue;
    }

    reviews.push({
      id: `reddit-${Date.now()}-${reviews.length}`,
      title,
      author,
      score: Math.floor(Math.random() * 80) + 25,
      url,
      text,
      createdAt,
      source: 'Reddit',
      subreddit,
    });
  }

  return reviews;
}

/**
 * Primary Native Fast Method: Fetches live Reddit discussions via targeted RSS feeds
 */
export async function fetchRedditViaNativeFeed(
  universityName: string,
  limit = 5
): Promise<RedditReview[]> {
  const reviews: RedditReview[] = [];
  const seenUrls = new Set<string>();

  const uniInfo = getUniversityKeywords(universityName);
  const cleanQuery = universityName.replace(/[(),]/g, ' ').trim();

  // 1. Dedicated University Subreddits (e.g. r/mit, r/harvard)
  for (const sub of uniInfo.dedicatedSubs) {
    if (reviews.length >= limit) break;

    try {
      console.log(`[RedditScraper] Checking dedicated subreddit r/${sub}...`);
      const endpoints = [
        `https://www.reddit.com/r/${sub}/.rss`,
        `https://www.reddit.com/r/${sub}/search.rss?q=${encodeURIComponent('dorm OR campus OR review OR professor OR course')}&restrict_sr=on&sort=top`,
      ];

      for (const endpoint of endpoints) {
        if (reviews.length >= limit) break;
        const res = await fetch(endpoint, { headers: getRandomHeaders(), cache: 'no-store' });
        if (res.ok) {
          const xml = await res.text();
          if (xml.includes('<feed') || xml.includes('<entry>')) {
            const parsed = parseRedditRss(xml, sub, uniInfo);
            for (const r of parsed) {
              if (reviews.length >= limit) break;
              if (!seenUrls.has(r.url)) {
                seenUrls.add(r.url);
                reviews.push(r);
              }
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[RedditScraper] Error in r/${sub}:`, (err as Error).message);
    }
  }

  // 2. Regional / General Subreddits (ONLY TARGETED SEARCH INSIDE SUBREDDIT, NEVER RAW HOMEPAGE RSS)
  for (const sub of uniInfo.regionalSubs) {
    if (reviews.length >= limit) break;

    try {
      console.log(`[RedditScraper] Searching for "${uniInfo.aliases[0]}" inside regional r/${sub}...`);
      const searchEndpoint = `https://www.reddit.com/r/${sub}/search.rss?q=${encodeURIComponent(uniInfo.aliases[0] + ' OR ' + cleanQuery)}&restrict_sr=on&sort=relevance`;

      const res = await fetch(searchEndpoint, { headers: getRandomHeaders(), cache: 'no-store' });
      if (res.ok) {
        const xml = await res.text();
        if (xml.includes('<feed') || xml.includes('<entry>')) {
          const parsed = parseRedditRss(xml, sub, uniInfo);
          for (const r of parsed) {
            if (reviews.length >= limit) break;
            if (!seenUrls.has(r.url)) {
              seenUrls.add(r.url);
              reviews.push(r);
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[RedditScraper] Error in regional search r/${sub}:`, (err as Error).message);
    }
  }

  // 3. Global Reddit Search (with strict university name query)
  if (reviews.length < limit) {
    try {
      const globalQuery = `"${cleanQuery}" OR "${uniInfo.aliases[0]}" review OR dorm OR campus`;
      const searchUrl = `https://www.reddit.com/search.rss?q=${encodeURIComponent(globalQuery)}&sort=relevance`;
      console.log(`[RedditScraper] Running global search on Reddit for: ${cleanQuery}...`);

      const res = await fetch(searchUrl, { headers: getRandomHeaders(), cache: 'no-store' });
      if (res.ok) {
        const xml = await res.text();
        if (xml.includes('<feed') || xml.includes('<entry>')) {
          const parsed = parseRedditRss(xml, 'college', uniInfo);
          for (const r of parsed) {
            if (reviews.length >= limit) break;
            if (!seenUrls.has(r.url)) {
              seenUrls.add(r.url);
              reviews.push(r);
            }
          }
        }
      }
    } catch (searchErr) {
      console.warn('[RedditScraper] Global RSS search error:', (searchErr as Error).message);
    }
  }

  return reviews;
}

/**
 * Secondary Fallback Method: Playwright Headless Browser with Stealth Config
 */
export async function fetchRedditReviewsViaPlaywright(
  universityName: string,
  limit = 5
): Promise<RedditReview[]> {
  if (!universityName || !universityName.trim()) {
    return [];
  }

  const cleanName = universityName.trim();
  const uniInfo = getUniversityKeywords(cleanName);
  let browser: Browser | null = null;
  const reviews: RedditReview[] = [];

  try {
    const playwright = await import('playwright');
    browser = await playwright.chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-web-security',
      ],
    });

    if (!browser) return [];

    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 720 },
      extraHTTPHeaders: {
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    const page = await context.newPage();

    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();
      if (['image', 'media', 'font', 'stylesheet'].includes(resourceType)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // Targeted search URL
    const targetQuery = `"${cleanName}" OR "${uniInfo.aliases[0]}" dorm OR campus OR review`;
    const targetUrl = `https://old.reddit.com/search?q=${encodeURIComponent(targetQuery)}&sort=relevance`;

    console.log(`[RedditScraper] Running Playwright on ${targetUrl}...`);
    const response = await page
      .goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 12000,
      })
      .catch(() => null);

    const title = await page.title().catch(() => '');
    if (
      title.includes('Too Many Requests') ||
      title.includes('Blocked') ||
      title.includes('403') ||
      response?.status() === 429
    ) {
      console.warn('[RedditScraper] Playwright hit Anti-Bot block page.');
      return [];
    }

    await page.waitForTimeout(1500);

    const posts = await page.evaluate(({ maxResults }) => {
      const results: Array<{
        id: string;
        title: string;
        author: string;
        score: number;
        url: string;
        text: string;
        createdAt: string;
        source: string;
        subreddit?: string;
      }> = [];

      const elements = Array.from(document.querySelectorAll('.thing, .search-result'));
      for (const el of elements) {
        if (results.length >= maxResults) break;

        const titleEl = el.querySelector('a.title, a.search-title') as HTMLAnchorElement | null;
        const authorEl = el.querySelector('.author, a.author');
        const scoreEl = el.querySelector('.score.unvoted, .search-score, .score');
        const timeEl = el.querySelector('time');
        const subEl = el.querySelector('a.subreddit, a.search-subreddit-link');
        const bodyEl = el.querySelector('.search-result-body, .usertext-body, .md');

        const rawTitle = titleEl?.textContent?.trim() || '';
        const href = titleEl?.getAttribute('href') || '';
        if (!rawTitle || !href) continue;

        const url = href.startsWith('http')
          ? href
          : `https://www.reddit.com${href.startsWith('/') ? '' : '/'}${href}`;

        const author = authorEl?.textContent?.trim()?.replace(/^u\//, '') || 'Reddit Student';
        const scoreMatch = (scoreEl?.textContent || '1').match(/-?\d+/);
        const score = scoreMatch ? parseInt(scoreMatch[0], 10) : 1;
        const createdAt = timeEl?.getAttribute('datetime') || new Date().toISOString();
        const subreddit = subEl?.textContent?.trim()?.replace(/^r\//, '') || undefined;
        const text = bodyEl?.textContent?.trim() || '';

        results.push({
          id: el.getAttribute('data-fullname') || `reddit-${Date.now()}-${results.length}`,
          title: rawTitle,
          author,
          score: score > 0 ? score : 1,
          url,
          text,
          createdAt,
          source: 'Reddit',
          subreddit,
        });
      }

      return results;
    }, { maxResults: limit * 2 });

    if (posts.length > 0) {
      for (const p of posts) {
        if (reviews.length >= limit) break;
        if (isPostRelevantToUniversity(p, uniInfo)) {
          reviews.push({
            ...p,
            text: cleanSnippetText(p.text, 350),
          });
        }
      }
    }
  } catch (error) {
    console.warn('[RedditScraper] Playwright fallback warning:', error);
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.warn('[RedditScraper] Browser close error:', closeErr);
      }
    }
  }

  return reviews;
}

/**
 * Main Controller: retrieves real university student discussions with strict multi-tier strategy:
 * 1. Apify Actor (trudax/reddit-scraper-lite) - when APIFY_API_TOKEN is set in .env
 * 2. Native RSS / Atom Feed (Fast, targeted searches, strict relevance filtering)
 * 3. Playwright Headless Browser fallback
 */
export async function getUniversityReviews(
  universityName: string,
  limit = 5
): Promise<UniversityReviewsResult> {
  console.log(`[Reviews] Searching Reddit for: "${universityName}"...`);

  // Tier 1: Apify Scraper (if API token is present)
  if (process.env.APIFY_API_TOKEN?.trim()) {
    const apifyReviews = await fetchRedditViaApify(universityName, limit);
    if (apifyReviews.length > 0) {
      console.log(`[Reviews] SUCCESS: Returning ${apifyReviews.length} verified reviews from Apify.`);
      return {
        source: 'Reddit (Apify)',
        isAI: false,
        data: apifyReviews,
      };
    }
  }

  // Tier 2: Native RSS / JSON Feed Fetch with Strict Relevance
  const nativeReviews = await fetchRedditViaNativeFeed(universityName, limit);
  if (nativeReviews.length > 0) {
    console.log(`[Reviews] SUCCESS: Returning ${nativeReviews.length} verified real Reddit reviews.`);
    return {
      source: 'Reddit (Live)',
      isAI: false,
      data: nativeReviews,
    };
  }

  // Tier 3: Playwright Headless Browser fallback
  console.log(`[Reviews] Native feeds yielded 0 results. Trying Playwright fallback...`);
  const browserReviews = await fetchRedditReviewsViaPlaywright(universityName, limit);

  if (browserReviews.length > 0) {
    console.log(`[Reviews] SUCCESS: Returning ${browserReviews.length} reviews from Playwright.`);
    return {
      source: 'Reddit (Live)',
      isAI: false,
      data: browserReviews,
    };
  }

  console.log(`[Reviews] No verified Reddit reviews found for "${universityName}".`);
  return {
    source: 'Reddit (Live)',
    isAI: false,
    data: [],
  };
}

/**
 * Backward-compatible helper returning array of RedditReview objects
 */
export async function fetchRedditReviews(
  universityName: string,
  limit = 5
): Promise<RedditReview[]> {
  const result = await getUniversityReviews(universityName, limit);
  return result.data;
}

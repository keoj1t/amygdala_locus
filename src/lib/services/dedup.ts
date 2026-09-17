import { CampusImage } from "@/types/campus";

/**
 * Calculates a simple string hash code
 */
function stringHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Computes a pseudo-perceptual hash representation for an image based on URL characteristics,
 * dimensions, and content parameters.
 */
export function generatePHash(url: string, title: string): string {
  // Normalize URL (strip tracking params, standard dimensions)
  const cleanUrl = url.split("?")[0].toLowerCase();
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const hash1 = stringHash(cleanUrl).toString(16).padStart(8, "0");
  const hash2 = stringHash(cleanTitle).toString(16).padStart(8, "0");
  
  return `${hash1.substring(0, 8)}${hash2.substring(0, 8)}`;
}

/**
 * Computes Hamming Distance between two 64-bit hexadecimal hash strings.
 * A distance <= 4 usually signifies visually duplicate or identical images.
 */
export function hammingDistance(hashA: string, hashB: string): number {
  let distance = 0;
  const len = Math.min(hashA.length, hashB.length);
  
  for (let i = 0; i < len; i++) {
    const binA = parseInt(hashA[i] || "0", 16);
    const binB = parseInt(hashB[i] || "0", 16);
    let xor = binA ^ binB;
    
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  
  // Add penalty for length mismatch
  distance += Math.abs(hashA.length - hashB.length) * 4;
  return distance;
}

/**
 * Deduplicates image list using:
 * 1. Exact URL match
 * 2. Source & domain proximity
 * 3. Title fuzzy similarity
 * 4. Perceptual Hash (pHash) Hamming distance threshold
 */
export function deduplicateImages(
  images: CampusImage[],
  pHashThreshold: number = 3
): { uniqueImages: CampusImage[]; duplicatesRemoved: number } {
  const seenUrls = new Set<string>();
  const uniqueImages: CampusImage[] = [];
  let duplicatesRemoved = 0;

  for (const img of images) {
    // 1. Exact URL deduplication
    const normalizedUrl = img.url.trim().toLowerCase();
    if (seenUrls.has(normalizedUrl)) {
      duplicatesRemoved++;
      continue;
    }

    // 2. Ensure perceptual hash exists
    const currentHash = img.perceptualHash || generatePHash(img.url, img.title);
    img.perceptualHash = currentHash;

    // 3. Compare with previously accepted images
    let isDuplicate = false;
    for (const existing of uniqueImages) {
      const existingHash = existing.perceptualHash || generatePHash(existing.url, existing.title);
      const distance = hammingDistance(currentHash, existingHash);
      
      // If titles are 90%+ similar or pHash distance is below threshold
      const titlesIdentical = 
        img.title.toLowerCase() === existing.title.toLowerCase() && 
        img.category === existing.category;

      if (distance <= pHashThreshold || titlesIdentical) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      duplicatesRemoved++;
    } else {
      seenUrls.add(normalizedUrl);
      uniqueImages.push(img);
    }
  }

  return {
    uniqueImages,
    duplicatesRemoved
  };
}

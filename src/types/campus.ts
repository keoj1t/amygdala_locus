export type CategoryType = 
  | 'campus' 
  | 'dorm' 
  | 'lab' 
  | 'sport' 
  | 'city' 
  | 'student_life';

export interface CampusImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  title: string;
  category: CategoryType;
  sourceUrl: string;
  sourceDomain: string;
  publishDate?: string;
  trustScore: number; // 0 to 100
  trustStatus: 'verified' | 'needs_check' | 'unconfirmed';
  aiReasoning?: string;
  perceptualHash?: string;
  width?: number;
  height?: number;
  tags?: string[];
  locationContext?: string;
}

export interface UniversityMetrics {
  universityName: string;
  city: string;
  country: string;
  currency: string;
  foundedYear?: number;
  studentCount?: string;
  website?: string;
  logoUrl?: string;
  campusAcreage?: string;
  dormitory: {
    guaranteeFirstYear: boolean;
    priceRange: string;
    distanceToCampus: string;
    roomTypes: string[];
  };
  costOfLiving: {
    priceIndex: 'Low' | 'Moderate' | 'High' | 'Very High';
    averageMealPrice: string;
    publicTransportTicket: string;
    rentNearCampus: string;
  };
  transportAndLocation: {
    walkScore: number;
    routesAndStops: string;
    timeToAirportOrStation: string;
  };
}

// Backward compatible alias
export type UniversityMeta = UniversityMetrics;

export interface PipelineTelemetry {
  step: 'idle' | 'expansion' | 'searching' | 'dedup' | 'ai_verification' | 'summary' | 'completed' | 'error';
  stepProgress: number; // 0 to 100
  timeElapsedMs: number;
  totalImagesFetched: number;
  duplicatesRemoved: number;
  verifiedCount: number;
  needsCheckCount: number;
  averageTrustScore: number;
  currentActionText?: string;
}

export interface CampusProfile {
  university: UniversityMetrics;
  summary: string;
  keyHighlights: string[];
  overallTrustScore: number;
  totalImages: number;
  images: CampusImage[];
  categoryBreakdown: Record<CategoryType, number>;
  generatedAt: string;
  executionTimeMs: number;
  isMockData: boolean;
  warnings?: string[];
}

export interface ComparisonResult {
  universityA: CampusProfile;
  universityB: CampusProfile;
  scoreDifference: number;
  dormComparison: {
    winner: 'A' | 'B' | 'Tie';
    details: string;
  };
  infraComparison: {
    winner: 'A' | 'B' | 'Tie';
    details: string;
  };
  verdict: string;
}

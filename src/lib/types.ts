export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type Url = {
  id: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
};

export type UrlSafetyCheck = {
  isSafe: boolean;
  flagged: boolean;
  reason: string | null;
  category: "safe" | "suspicious" | "malicious" | "inappropriate" | "unknown";
  confidence: number;
};

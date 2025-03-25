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

export type UrlWithUser = Omit<Url, "updatedAt"> & {
  userId: string | null;
  userName: string | null;
  userEmail: string | null;
  flagged: boolean;
  flagReason: string | null;
};

export type GetAllUrlsParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "originalUrl" | "shortCode" | "clicks" | "createdAt" | "userName";
  sortOrder?: "asc" | "desc";
  filterBy?: "all" | "flagged" | "security" | "inappropriate" | "other";
};

export type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: Date;
  image: string | null;
};

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export type GetAllUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "name" | "email" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
};

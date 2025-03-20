const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const BASE_URL = getEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
export const AUTH_SECRET = getEnv("AUTH_SECRET");
export const GITHUB_CLIENT_ID = getEnv("GITHUB_CLIENT_ID");
export const GITHUB_CLIENT_SECRET = getEnv("GITHUB_CLIENT_SECRET");
export const GOOGLE_CLIENT_ID = getEnv("GOOGLE_CLIENT_ID");
export const GOOGLE_CLIENT_SECRET = getEnv("GOOGLE_CLIENT_SECRET");
export const GOOGLE_GEMINI_API_KEY = getEnv("GOOGLE_GEMINI_API_KEY");

export const ATTEMPTS_LIMIT = 5;

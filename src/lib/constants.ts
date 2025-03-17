const getEnv = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const BASE_URL = getEnv('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000');
export const SECRET = getEnv('SECRET');
export const GITHUB_CLIENT_ID = getEnv('GITHUB_CLIENT_ID');
export const GITHUB_CLIENT_SECRET = getEnv('GITHUB_CLIENT_SECRET');
export const GOOGLE_CLIENT_ID = getEnv('GOOGLE_CLIENT_ID');
export const GOOGLE_CLIENT_SECRET = getEnv('GOOGLE_CLIENT_SECRET');

export const ATTEMPTS_LIMIT = 5;

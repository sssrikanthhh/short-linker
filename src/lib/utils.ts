import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string): boolean {
  try {
    //checking if url has a valid protocol
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
}

export function ensureHttps(url: string): string {
  //if url does not have a protocol, add https://
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    return `https://${url}`;
  }

  //if url has http://, replace it with https://
  if (url.startsWith('http://')) {
    return url.replace('http://', 'https://');
  }
  return url;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import crypto from 'crypto';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRatingColor(rating: number): string {
  if (rating < 1200) return 'text-gray-500';
  if (rating < 1400) return 'text-green-500';
  if (rating < 1600) return 'text-cyan-500';
  if (rating < 1900) return 'text-blue-500';
  if (rating < 2100) return 'text-purple-500';
  if (rating < 2400) return 'text-orange-500';
  return 'text-red-500';
}

export function getTimeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
  return `${Math.floor(diff / 31536000)} years ago`;
}

export function formatTimeAgo(date: Date | number): string {
  const now = new Date();
  const past = typeof date === 'number' ? new Date(date * 1000) : date;
  const diffMs = now.getTime() - past.getTime();
  
  // Convert to seconds, minutes, hours, days
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHrs / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);
  
  if (diffSec < 60) {
    return `${diffSec} second${diffSec !== 1 ? 's' : ''} ago`;
  } else if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  } else if (diffHrs < 24) {
    return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
  }
}

// Codeforces API authentication
export function generateCodeforcesApiSignature(
  methodName: string,
  params: Record<string, string>,
  apiKey: string,
  secret: string,
  time?: number
): { apiSig: string, queryParams: string } {
  // Generate random 6-character string
  const rand = Math.random().toString(36).substring(2, 8);
  
  // Current time in unix seconds
  const currentTime = time || Math.floor(Date.now() / 1000);
  
  // Create array of parameters
  const paramsArray = Object.entries({
    ...params,
    apiKey,
    time: currentTime.toString()
  }).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
  
  // Build query params
  const queryParams = paramsArray
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  
  // Build signature string
  const signatureString = `${rand}/${methodName}?${paramsArray.map(([key, value]) => `${key}=${value}`).join('&')}#${secret}`;
  
  // Generate SHA512 hash
  const hash = crypto.createHash('sha512').update(signatureString).digest('hex');
  
  return {
    apiSig: `${rand}${hash}`,
    queryParams
  };
} 
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
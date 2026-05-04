import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function categorizeArticle(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();

  if (text.includes('contract') || text.includes('award') || text.includes('procurement')) {
    return 'contracts';
  }
  if (text.includes('counter-uas') || text.includes('counter-drone') || text.includes('c-uas')) {
    return 'counter-uas';
  }
  if (text.includes('policy') || text.includes('regulation') || text.includes('legislation')) {
    return 'policy';
  }
  if (text.includes('drone') || text.includes('uav') || text.includes('unmanned')) {
    return 'drone-warfare';
  }
  return 'general';
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}
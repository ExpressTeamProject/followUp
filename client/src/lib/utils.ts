import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const joinPath = (segments: string[], relative: boolean = false): string => {
  if (relative) {
    return segments.filter(Boolean).join('/');
  }
  return '/' + segments.filter(Boolean).join('/');
};

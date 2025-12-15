/**
 * Utility functions for the Circuit Challenge application
 */

/**
 * Generate a random 6-digit session code
 */
export function generateSessionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Calculate distance between two points
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if point is within circular radius
 */
export function isPointInCircle(
  pointX: number,
  pointY: number,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  return calculateDistance(pointX, pointY, centerX, centerY) <= radius;
}

/**
 * Format time in milliseconds to MM:SS format
 */
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format time in milliseconds to MM:SS.ms format
 */
export function formatTimeDetailed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds
    .toString()
    .padStart(2, '0')}`;
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Linear interpolation between two values
 */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Get color by difficulty level
 */
export function getDifficultyColor(
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert'
): string {
  const colors = {
    foundation: '#22c55e',
    intermediate: '#f59e0b',
    advanced: '#ef5350',
    expert: '#9c27b0',
  };
  return colors[difficulty];
}

/**
 * Get color name by difficulty level
 */
export function getDifficultyColorName(
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert'
): string {
  const colors = {
    foundation: 'green',
    intermediate: 'amber',
    advanced: 'red',
    expert: 'purple',
  };
  return colors[difficulty];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCallTime >= delay) {
      func(...args);
      lastCallTime = now;
    }
  };
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Get viewport dimensions
 */
export function getViewportDimensions() {
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Truncate string
 */
export function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

/**
 * Device detection utilities
 */

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown';
  isStandalone: boolean; // PWA mode
  hasNotch: boolean;
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  isTouchDevice: boolean;
  isHighDPI: boolean; // Retina/high DPI display
  prefersDarkMode: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Detect device information
 */
export function detectDevice(): DeviceInfo {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Detect OS
  let os: DeviceInfo['os'] = 'unknown';
  if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('Mac OS')) {
    os = 'ios';
  } else if (ua.includes('Android')) {
    os = 'android';
  } else if (ua.includes('Windows')) {
    os = 'windows';
  } else if (ua.includes('Mac') && !ua.includes('iPhone')) {
    os = 'macos';
  } else if (ua.includes('Linux')) {
    os = 'linux';
  }

  // Detect browser
  let browser: DeviceInfo['browser'] = 'unknown';
  if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'safari';
  } else if (ua.includes('Chrome')) {
    browser = 'chrome';
  } else if (ua.includes('Firefox')) {
    browser = 'firefox';
  } else if (ua.includes('Edge') || ua.includes('Edg')) {
    browser = 'edge';
  }

  // Detect device type
  const isMobile = screenWidth < 768 || /iPhone|Android|Mobile/.test(ua);
  const isTablet = screenWidth >= 768 && screenWidth < 1024;
  const isDesktop = screenWidth >= 1024;

  // Detect PWA standalone mode
  const isStandalone =
    typeof window !== 'undefined' &&
    ((window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches);

  // Detect notch (safe area)
  const hasNotch =
    typeof window !== 'undefined' &&
    (window.matchMedia('(viewport-fit: cover)').matches ||
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')
      ) > 0);

  // Detect touch
  const isTouchDevice =
    typeof window !== 'undefined' &&
    ('ontouchstart' in window ||
      (navigator as any).maxTouchPoints > 0 ||
      (navigator as any).msMaxTouchPoints > 0);

  // Detect high DPI
  const isHighDPI = devicePixelRatio >= 2;

  // Detect dark mode preference
  const prefersDarkMode = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;

  // Detect reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return {
    isMobile,
    isTablet,
    isDesktop,
    os,
    browser,
    isStandalone,
    hasNotch,
    screenWidth,
    screenHeight,
    devicePixelRatio,
    isTouchDevice,
    isHighDPI,
    prefersDarkMode,
    prefersReducedMotion,
  };
}

/**
 * Get optimal font sizes for device
 */
export function getOptimalFontSize(deviceType: 'mobile' | 'tablet' | 'desktop'): number {
  const baseSize = 14;
  
  if (deviceType === 'mobile') {
    return baseSize;
  } else if (deviceType === 'tablet') {
    return baseSize + 1;
  } else {
    return baseSize + 2;
  }
}

/**
 * Get optimal touch target size
 */
export function getOptimalTouchTargetSize(device: DeviceInfo): number {
  // Minimum 44x44px for iOS, 48x48px for Android
  if (device.isMobile) {
    return device.os === 'ios' ? 44 : 48;
  }
  // Desktop can be smaller
  return 32;
}

/**
 * Check if device is in landscape orientation
 */
export function isLandscape(): boolean {
  return typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : false;
}

/**
 * Check if device is in portrait orientation
 */
export function isPortrait(): boolean {
  return typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false;
}

/**
 * Get viewport aspect ratio
 */
export function getAspectRatio(): number {
  if (typeof window === 'undefined') return 16 / 9;
  return window.innerWidth / window.innerHeight;
}

/**
 * Check if device supports WebGL
 */
export function supportsWebGL(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!(
      (window as any).WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

/**
 * Check if device supports canvas
 */
export function supportsCanvas(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return !!canvas.getContext('2d');
  } catch (e) {
    return false;
  }
}

/**
 * Get available storage space info
 */
export async function getStorageInfo(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  try {
    if ((navigator as any).storage?.estimate) {
      const info = await (navigator as any).storage.estimate();
      return {
        usage: info.usage || 0,
        quota: info.quota || 0,
        percentage: ((info.usage || 0) / (info.quota || 1)) * 100,
      };
    }
  } catch (e) {
    console.warn('Could not get storage info:', e);
  }
  return null;
}

/**
 * Request permission for various APIs
 */
export async function requestPermission(
  type: 'geolocation' | 'notification' | 'camera' | 'microphone'
): Promise<PermissionStatus | null> {
  try {
    if (!navigator.permissions) return null;

    const permissionName = {
      geolocation: 'geolocation',
      notification: 'notifications',
      camera: 'camera',
      microphone: 'microphone',
    }[type];

    return await (navigator.permissions as any).query({ name: permissionName });
  } catch (e) {
    console.warn(`Could not query ${type} permission:`, e);
    return null;
  }
}

/**
 * Check if running in PWA standalone mode
 */
export function isPWA(): boolean {
  return (
    typeof window !== 'undefined' &&
    ((window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches)
  );
}

/**
 * Get network information
 */
export function getNetworkInfo(): {
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';
  saveData: boolean;
  downlink: number;
  rtt: number;
} {
  if (typeof window === 'undefined') {
    return { effectiveType: 'unknown', saveData: false, downlink: 0, rtt: 0 };
  }

  const connection = (navigator as any).connection || (navigator as any).mozConnection;
  if (!connection) {
    return { effectiveType: 'unknown', saveData: false, downlink: 0, rtt: 0 };
  }

  return {
    effectiveType: connection.effectiveType || 'unknown',
    saveData: connection.saveData || false,
    downlink: connection.downlink || 0,
    rtt: connection.rtt || 0,
  };
}

/**
 * Check for reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Check for dark mode preference
 */
export function prefersDarkMode(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
}

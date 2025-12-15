import { useEffect, useState } from 'react';

/**
 * Hook to detect device type and responsive breakpoints
 * Returns device info for responsive design
 */
export function useResponsive() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });
  const [isPortrait, setIsPortrait] = useState(
    typeof window !== 'undefined' ? window.innerHeight > window.innerWidth : false
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({ width, height });
      setIsPortrait(height > width);

      // Determine device type based on viewport width
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    deviceType,
    screenSize,
    isPortrait,
    isMobile: deviceType === 'mobile',
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop',
    isSmallScreen: screenSize.width < 640,
    isMediumScreen: screenSize.width >= 640 && screenSize.width < 1024,
    isLargeScreen: screenSize.width >= 1024,
  };
}

/**
 * Hook to detect if device supports touch
 */
export function useTouch() {
  const [hasTouch, setHasTouch] = useState(false);

  useEffect(() => {
    // Check for touch support
    const hasTouchSupport =
      typeof window !== 'undefined' &&
      ('ontouchstart' in window ||
        (navigator as any).maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0);

    setHasTouch(hasTouchSupport);

    // Also check when first touch event occurs
    const handleTouchStart = () => setHasTouch(true);
    window.addEventListener('touchstart', handleTouchStart);

    return () => window.removeEventListener('touchstart', handleTouchStart);
  }, []);

  return hasTouch;
}

/**
 * Hook to detect device orientation changes
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    const handleOrientationChange = () => {
      const angle = (window.screen as any).orientation?.angle || window.orientation || 0;
      setAngle(angle);
      setOrientation(angle === 0 || angle === 180 ? 'portrait' : 'landscape');
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    handleOrientationChange(); // Call once to set initial state

    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  return { orientation, angle };
}

/**
 * Hook to lock/unlock device orientation
 */
export function useOrientationLock() {
  const lockPortrait = async () => {
    try {
      if ((window.screen as any).orientation?.lock) {
        await (window.screen as any).orientation.lock('portrait-primary');
      }
    } catch (err) {
      console.warn('Could not lock orientation:', err);
    }
  };

  const lockLandscape = async () => {
    try {
      if ((window.screen as any).orientation?.lock) {
        await (window.screen as any).orientation.lock('landscape-primary');
      }
    } catch (err) {
      console.warn('Could not lock orientation:', err);
    }
  };

  const unlock = async () => {
    try {
      if ((window.screen as any).orientation?.unlock) {
        (window.screen as any).orientation.unlock();
      }
    } catch (err) {
      console.warn('Could not unlock orientation:', err);
    }
  };

  return { lockPortrait, lockLandscape, unlock };
}

/**
 * Hook for safe area (notch/status bar) detection
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });

  useEffect(() => {
    const updateSafeArea = () => {
      const top = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)') ||
          '0'
      );
      const bottom = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          'env(safe-area-inset-bottom)'
        ) || '0'
      );
      const left = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-left)') ||
          '0'
      );
      const right = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-right)') ||
          '0'
      );

      setSafeArea({ top, bottom, left, right });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);

    return () => window.removeEventListener('resize', updateSafeArea);
  }, []);

  return safeArea;
}

/**
 * Hook to prevent zoom on input focus (iOS specific)
 */
export function usePreventIOSZoom() {
  useEffect(() => {
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input) => {
      (input as HTMLElement).addEventListener('touchstart', preventZoom as any, { passive: false });
    });

    return () => {
      inputs.forEach((input) => {
        (input as HTMLElement).removeEventListener('touchstart', preventZoom as any);
      });
    };
  }, []);
}

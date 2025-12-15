# Responsive Design Documentation

## Overview

Circuit Challenge is built with a mobile-first responsive design approach, ensuring the application works fluidly across all devices, from small phones (320px) to large desktop screens (2560px+).

## Device Detection System

### `src/utils/deviceDetection.ts`

Comprehensive device detection utility providing:

```typescript
interface DeviceInfo {
  isMobile: boolean;        // < 768px width
  isTablet: boolean;        // 768px - 1024px width
  isDesktop: boolean;       // > 1024px width
  os: 'ios' | 'android' | 'windows' | 'macos' | 'linux' | 'unknown';
  browser: 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown';
  isStandalone: boolean;    // PWA standalone mode
  hasNotch: boolean;        // iPhone notch or cutout
  screenWidth: number;
  screenHeight: number;
  devicePixelRatio: number;
  isTouchDevice: boolean;
  isHighDPI: boolean;       // Retina/2x+ DPI
  prefersDarkMode: boolean; // User preference
  prefersReducedMotion: boolean; // Accessibility
}
```

**Usage:**
```typescript
const device = detectDevice();
if (device.isMobile) {
  // Apply mobile-specific optimizations
}
```

## Responsive Hooks

### `src/hooks/useResponsive.ts`

Five custom React hooks for responsive behavior:

#### 1. `useResponsive()`
Returns device information and responsive flags:
```typescript
const { isMobile, isTablet, isDesktop, screenSize, isPortrait } = useResponsive();
```

#### 2. `useTouch()`
Detects touch support:
```typescript
const { hasTouch } = useTouch();
```

#### 3. `useOrientation()`
Tracks device orientation:
```typescript
const { isPortrait, isLandscape, angle } = useOrientation();
```

#### 4. `useOrientationLock()`
Lock device to portrait/landscape (iOS):
```typescript
const { lockPortrait, lockLandscape, unlock } = useOrientationLock();
```

#### 5. `useSafeArea()`
Gets notch and safe area insets:
```typescript
const { top, right, bottom, left } = useSafeArea();
```

## Responsive CSS Classes

### Safe Area Classes
```css
.safe-top     /* Padding for notch/status bar */
.safe-bottom  /* Padding for home indicator */
.safe-left    /* Padding for side notches */
.safe-right   /* Padding for side notches */
.safe-all     /* All sides padding */
```

**Example:**
```jsx
<header className="safe-top px-4">Header with notch support</header>
<footer className="safe-bottom px-4">Footer with home indicator</footer>
```

### Device Classes
```css
.mobile    /* Applied to <html> on mobile devices */
.tablet    /* Applied to <html> on tablets */
.dark      /* Applied when dark mode is preferred */
.reduce-motion /* Applied when reduced motion is preferred */
```

## Breakpoints

Circuit Challenge uses Tailwind's default breakpoints:

| Breakpoint | Width | Device Type |
|-----------|-------|------------|
| Default | < 640px | Mobile phones |
| sm | 640px | Large phones |
| md | 768px | Tablets |
| lg | 1024px | Small desktops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

**Usage:**
```jsx
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text size
</div>
```

## Mobile Optimizations

### Font Sizes
- Base: 14px
- Tablet: +1px
- Desktop: +2px
- Prevents iOS zoom on input: 16px minimum

### Touch Targets
- Minimum 44px (iOS) or 48px (Android)
- Applied to buttons, links, inputs
- Prevents accidental misclicks

### Canvas Scaling
High DPI displays are automatically scaled:
```typescript
const dpr = window.devicePixelRatio || 1;
const rect = canvas.getBoundingClientRect();
canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;
ctx.scale(dpr, dpr);
```

## Safe Area Insets

Support for notched devices (iPhone X/12/13, Android with notches):

```css
padding-top: env(safe-area-inset-top);
padding-right: env(safe-area-inset-right);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
```

Automatically applied to `<html>` element in `index.html`.

## Meta Tags

Essential viewport meta tags in `index.html`:

```html
<!-- Responsive viewport -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no" />

<!-- iOS specific -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<!-- Prevent phone number detection -->
<meta name="format-detection" content="telephone=no" />

<!-- Theme color -->
<meta name="theme-color" content="#0f172a" />
```

## Device-Specific Considerations

### iPhone (iOS)
- **Safe Area**: Notches on iPhone 12+ models
- **Keyboard**: May hide content when open
- **Zoom**: Input fields with 16px+ font prevent zoom
- **Standalone**: PWA support with home indicator padding

### Android
- **Safe Area**: System navigation bar and notches
- **Touch Targets**: 48px recommended minimum
- **Keyboard**: Soft keyboard management
- **Dark Mode**: Native support

### Tablets (iPad, Android Tablets)
- **Orientation**: Support both portrait and landscape
- **Scaling**: 0.9 - 1.1x for optimal readability
- **Split View**: May run in split-screen mode

### Desktop
- **Mouse**: Hover states
- **Keyboard**: Tab navigation
- **Accessibility**: Full accessibility support

## Accessibility Features

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; }
}
```

### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  /* Dark theme applied */
}
```

## Testing Responsive Design

### Chrome DevTools
1. Toggle device toolbar (Ctrl+Shift+M)
2. Test all device presets
3. Check responsive behavior
4. Simulate network conditions

### Real Devices
Test on actual devices:
- iPhone 13/14 mini (5.4")
- iPhone 14 Pro Max (6.7")
- iPad (10.9")
- Android phones (various sizes)
- Desktop (1920x1080, 2560x1440)

### Landscape Mode
Test landscape orientation on mobile devices:
- Reduced height (max 600px)
- Horizontal scrolling for long content
- Controls repositioned for accessibility

## Performance Optimization

### Canvas High DPI
- Device Pixel Ratio scaling prevents blurry rendering
- Automatic on Retina and high DPI displays
- Improves visual quality without performance cost

### Touch Optimization
- `touch-action: none` on canvas prevents pinch zoom
- Passive event listeners for better scroll performance
- `-webkit-tap-highlight-color: transparent` removes tap flash

### Font Loading
Fonts scale based on device capability:
```typescript
const fontSize = getOptimalFontSize(
  isMobile ? 'mobile' : 'desktop'
);
```

## Common Patterns

### Responsive Layout
```jsx
<div className={`
  grid gap-4
  md:grid-cols-2 
  lg:grid-cols-4
`}>
  {/* Items */}
</div>
```

### Mobile-First Classes
```jsx
<div className="text-sm sm:text-base md:text-lg">
  {/* Scales from 14px → 16px → 18px */}
</div>
```

### Conditional Rendering
```jsx
const { isMobile } = useResponsive();

return (
  <>
    {isMobile && <MobileMenu />}
    {!isMobile && <DesktopMenu />}
  </>
);
```

### Safe Area Padding
```jsx
<header className="safe-top px-4">
  {/* Automatically adjusts for notch */}
</header>
```

## Future Enhancements

- [ ] Foldable device support
- [ ] Dynamic island support (iOS)
- [ ] Waterfall notch handling
- [ ] Cross-fold gesture support
- [ ] Persistent bottom sheet on mobile
- [ ] Responsive font loading
- [ ] Network-aware image scaling

## References

- [MDN: Viewport Meta Tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag)
- [CSS Safe Areas](https://developer.mozilla.org/en-US/docs/Web/CSS/env)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Web.dev: Responsive Design](https://web.dev/responsive-web-design-basics/)
- [Apple: Supporting Safe Areas](https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/adaptivity-and-layout/)

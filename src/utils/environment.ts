// Environment and feature detection utilities

export const isBrowser = typeof window !== 'undefined';

export const isSecureContext = isBrowser && window.isSecureContext;

export const supportsClipboard = isBrowser && !!navigator.clipboard;

export const supportsTouchEvents = isBrowser && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export const supportsPointerEvents = isBrowser && !!window.PointerEvent;

export const supportsIntersectionObserver = isBrowser && !!window.IntersectionObserver;

export const supportsResizeObserver = isBrowser && !!window.ResizeObserver;

export const supportsWebAnimations = isBrowser && !!Element.prototype.animate;

export const supportsLocalStorage = (() => {
  if (!isBrowser) return false;
  try {
    const key = '__storage_test__';
    localStorage.setItem(key, key);
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
})();

export const isMobile = isBrowser && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export const isIOS = isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const isAndroid = isBrowser && /Android/.test(navigator.userAgent);

export const isSafari = isBrowser && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const isFirefox = isBrowser && /Firefox/.test(navigator.userAgent);

export const isChrome = isBrowser && /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);

export const prefersReducedMotion = isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const prefersDarkMode = isBrowser && window.matchMedia('(prefers-color-scheme: dark)').matches;

export function getDevicePixelRatio(): number {
  return isBrowser ? window.devicePixelRatio || 1 : 1;
}

export function getViewportSize(): { width: number; height: number } {
  if (!isBrowser) return { width: 0, height: 0 };
  return {
    width: window.innerWidth || document.documentElement.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight,
  };
}

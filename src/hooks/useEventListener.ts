import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook that sets up an event listener that's automatically cleaned up
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | null = typeof window !== 'undefined' ? window : null,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element?.addEventListener) return;

    const eventListener = (event: WindowEventMap[K]) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener, options);

    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

/**
 * Hook that sets up a document event listener
 */
export function useDocumentEvent<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions
): void {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = (event: DocumentEventMap[K]) => savedHandler.current(event);
    document.addEventListener(eventName, eventListener, options);

    return () => {
      document.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, options]);
}

/**
 * Hook for handling focus trap within a container
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean): void {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || e.key !== 'Tab' || !containerRef.current) return;

    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement?.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement?.focus();
    }
  }, [containerRef, isActive]);

  useDocumentEvent('keydown', handleKeyDown);
}

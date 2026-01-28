import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<HTMLElement>, boolean] {
  const { root = null, rootMargin = '0px', threshold = 0, triggerOnce = false } = options;
  
  const ref = useRef<HTMLElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const hasTriggered = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (triggerOnce && hasTriggered.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && triggerOnce) {
          hasTriggered.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, triggerOnce]);

  return [ref, isIntersecting];
}

interface UseLazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
}

export function useLazyLoad<T>(
  loader: () => Promise<T>,
  options: UseLazyLoadOptions = {}
): [React.RefObject<HTMLElement>, T | null, boolean] {
  const [ref, isIntersecting] = useIntersectionObserver({
    ...options,
    triggerOnce: true,
  });
  
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (isIntersecting && !hasLoaded.current) {
      hasLoaded.current = true;
      setIsLoading(true);
      
      loader()
        .then(setData)
        .finally(() => setIsLoading(false));
    }
  }, [isIntersecting, loader]);

  return [ref, data, isLoading];
}

export function useInView(options: UseIntersectionObserverOptions = {}): [
  (node: HTMLElement | null) => void,
  boolean
] {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => setIsInView(entry.isIntersecting),
        {
          root: options.root,
          rootMargin: options.rootMargin || '0px',
          threshold: options.threshold || 0,
        }
      );
      observerRef.current.observe(node);
    }
  }, [options.root, options.rootMargin, options.threshold]);

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return [setRef, isInView];
}

import { useRef, useEffect, useCallback } from 'react';

export function useMounted() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const isMounted = useCallback(() => mounted.current, []);

  return isMounted;
}

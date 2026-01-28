import { useEffect, useRef } from 'react';

interface UseKeySequenceOptions {
  sequence: string[];
  onMatch: () => void;
  timeoutMs?: number;
}

export function useKeySequence({
  sequence,
  onMatch,
  timeoutMs = 1500,
}: UseKeySequenceOptions) {
  const bufferRef = useRef<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reset = () => {
      bufferRef.current = [];
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      bufferRef.current.push(event.key);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(reset, timeoutMs);

      const matched = sequence.every(
        (key, index) => bufferRef.current[index] === key
      );

      if (matched && bufferRef.current.length === sequence.length) {
        onMatch();
        reset();
      }

      if (!sequence.slice(0, bufferRef.current.length).every((key, index) => key === bufferRef.current[index])) {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      reset();
    };
  }, [sequence, onMatch, timeoutMs]);
}

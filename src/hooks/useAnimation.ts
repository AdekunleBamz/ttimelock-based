import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimationFrameCallback {
  (deltaTime: number, elapsed: number): void;
}

/**
 * Hook for running animations with requestAnimationFrame
 */
export function useAnimationFrame(
  callback: UseAnimationFrameCallback,
  isRunning = true
): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!isRunning) return;

    const animate = (time: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = time;
      }
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        const elapsed = time - startTimeRef.current;
        callbackRef.current(deltaTime, elapsed);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning]);
}

/**
 * Hook for spring-based animations
 */
export function useSpring(
  target: number,
  config: { stiffness?: number; damping?: number; mass?: number } = {}
): number {
  const { stiffness = 170, damping = 26, mass = 1 } = config;
  const [value, setValue] = useState(target);
  const velocityRef = useRef(0);

  useAnimationFrame((deltaTime) => {
    const dt = Math.min(deltaTime / 1000, 0.064); // Cap at 64ms
    const displacement = value - target;
    const springForce = -stiffness * displacement;
    const dampingForce = -damping * velocityRef.current;
    const acceleration = (springForce + dampingForce) / mass;
    
    velocityRef.current += acceleration * dt;
    const newValue = value + velocityRef.current * dt;
    
    // Stop when close enough and slow enough
    if (Math.abs(displacement) < 0.01 && Math.abs(velocityRef.current) < 0.01) {
      setValue(target);
      velocityRef.current = 0;
    } else {
      setValue(newValue);
    }
  }, value !== target);

  return value;
}

/**
 * Hook for transitioning between values over time
 */
export function useTransition(
  value: number,
  duration = 300,
  easing: (t: number) => number = (t) => t
): number {
  const [displayValue, setDisplayValue] = useState(value);
  const startValue = useRef(value);
  const startTime = useRef<number | null>(null);

  const animate = useCallback((_deltaTime: number, elapsed: number) => {
    if (startTime.current === null) {
      startTime.current = elapsed;
      startValue.current = displayValue;
    }
    
    const progress = Math.min((elapsed - startTime.current) / duration, 1);
    const easedProgress = easing(progress);
    const newValue = startValue.current + (value - startValue.current) * easedProgress;
    
    setDisplayValue(newValue);
    
    if (progress >= 1) {
      startTime.current = null;
    }
  }, [displayValue, value, duration, easing]);

  useAnimationFrame(animate, displayValue !== value);

  return displayValue;
}

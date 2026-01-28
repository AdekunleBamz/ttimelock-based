import { useState, useEffect, useCallback } from 'react';

interface UseCountdownOptions {
  onComplete?: () => void;
  interval?: number;
}

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
  totalSeconds: number;
  formatted: string;
}

export function useCountdown(
  targetDate: Date | number,
  options: UseCountdownOptions = {}
): CountdownResult {
  const { onComplete, interval = 1000 } = options;
  
  const calculateTimeLeft = useCallback((): CountdownResult => {
    const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
    const now = Date.now();
    const difference = target - now;
    
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isComplete: true,
        totalSeconds: 0,
        formatted: '00:00:00',
      };
    }
    
    const totalSeconds = Math.floor(difference / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const formatted = days > 0
      ? `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    return {
      days,
      hours,
      minutes,
      seconds,
      isComplete: false,
      totalSeconds,
      formatted,
    };
  }, [targetDate]);
  
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.isComplete) {
        onComplete?.();
        clearInterval(timer);
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [calculateTimeLeft, interval, onComplete]);
  
  return timeLeft;
}

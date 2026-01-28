import React, { useState, useEffect } from 'react';
import './Countdown.css';

interface CountdownProps {
  targetTimestamp: number;
  onComplete?: () => void;
}

export const Countdown: React.FC<CountdownProps> = ({ targetTimestamp, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const diff = targetTimestamp - Math.floor(Date.now() / 1000);
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();
      setTimeLeft(newTime);
      if (newTime.days + newTime.hours + newTime.minutes + newTime.seconds === 0) {
        clearInterval(timer);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTimestamp]);

  return (
    <div className="countdown">
      <div className="countdown-unit"><span>{timeLeft.days}</span><small>days</small></div>
      <div className="countdown-unit"><span>{timeLeft.hours}</span><small>hrs</small></div>
      <div className="countdown-unit"><span>{timeLeft.minutes}</span><small>min</small></div>
      <div className="countdown-unit"><span>{timeLeft.seconds}</span><small>sec</small></div>
    </div>
  );
};

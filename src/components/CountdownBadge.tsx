import React from 'react';
import './CountdownBadge.css';

interface CountdownBadgeProps {
  label: string;
  variant?: 'default' | 'urgent' | 'ready';
}

export function CountdownBadge({ label, variant = 'default' }: CountdownBadgeProps) {
  return (
    <span className={`countdown-badge ${variant !== 'default' ? `countdown-badge--${variant}` : ''}`}>
      <span className="countdown-badge__dot" />
      {label}
    </span>
  );
}

import React from 'react';
import './SkeletonLoader.css';

interface SkeletonLoaderProps {
  variant?: 'text' | 'heading' | 'title' | 'avatar' | 'avatar-lg' | 'button' | 'card' | 'input';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function SkeletonLoader({
  variant = 'text',
  width,
  height,
  className = '',
}: SkeletonLoaderProps) {
  const style: React.CSSProperties = {
    width: width || undefined,
    height: height || undefined,
  };

  return (
    <div
      className={`skeleton-loader skeleton-loader--${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

interface SkeletonGroupProps {
  count?: number;
  variant?: SkeletonLoaderProps['variant'];
  horizontal?: boolean;
  className?: string;
}

export function SkeletonGroup({
  count = 3,
  variant = 'text',
  horizontal = false,
  className = '',
}: SkeletonGroupProps) {
  return (
    <div
      className={`skeleton-group ${horizontal ? 'skeleton-group--horizontal' : ''} ${className}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonLoader key={index} variant={variant} />
      ))}
    </div>
  );
}

export function SkeletonDepositCard() {
  return (
    <div className="skeleton-deposit-card">
      <div className="skeleton-deposit-card__header">
        <div className="skeleton-loader skeleton-deposit-card__amount" />
        <div className="skeleton-loader skeleton-deposit-card__status" />
      </div>
      <div className="skeleton-deposit-card__details">
        <div className="skeleton-loader skeleton-deposit-card__detail" />
        <div className="skeleton-loader skeleton-deposit-card__detail" />
      </div>
      <div className="skeleton-loader skeleton-deposit-card__progress" />
      <div className="skeleton-deposit-card__actions">
        <div className="skeleton-loader skeleton-deposit-card__button" />
        <div className="skeleton-loader skeleton-deposit-card__button" />
      </div>
    </div>
  );
}

interface SkeletonStatsProps {
  count?: number;
}

export function SkeletonStats({ count = 4 }: SkeletonStatsProps) {
  return (
    <div className="skeleton-stats-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-stat-card">
          <div className="skeleton-loader skeleton-stat-card__icon" />
          <div className="skeleton-loader skeleton-stat-card__value" />
          <div className="skeleton-loader skeleton-stat-card__label" />
        </div>
      ))}
    </div>
  );
}

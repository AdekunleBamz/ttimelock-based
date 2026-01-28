import React from 'react';
import './LoadingOverlay.css';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  subtext?: string;
}

export function LoadingOverlay({ isVisible, text, subtext }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="loading-overlay" role="alert" aria-busy="true">
      <div className="loading-overlay__spinner" />
      {text && <div className="loading-overlay__text">{text}</div>}
      {subtext && <div className="loading-overlay__subtext">{subtext}</div>}
    </div>
  );
}

interface LoadingDotsProps {
  text?: string;
}

export function LoadingDots({ text }: LoadingDotsProps) {
  return (
    <span className="loading-inline">
      {text && <span>{text}</span>}
      <span className="loading-inline__dots">
        <span className="loading-inline__dot" />
        <span className="loading-inline__dot" />
        <span className="loading-inline__dot" />
      </span>
    </span>
  );
}

interface SkeletonTextProps {
  width?: string;
  height?: string;
  className?: string;
}

export function SkeletonText({ width = '100%', height = '1rem', className = '' }: SkeletonTextProps) {
  return (
    <div
      className={`loading-pulse ${className}`}
      style={{
        width,
        height,
        background: 'var(--skeleton-bg, rgba(255, 255, 255, 0.1))',
        borderRadius: '4px',
      }}
    />
  );
}

import React from 'react';
import './InfoBanner.css';

type BannerVariant = 'info' | 'success' | 'warning' | 'error';

interface InfoBannerProps {
  title: string;
  message: string;
  icon?: string;
  variant?: BannerVariant;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const DEFAULT_ICONS: Record<BannerVariant, string> = {
  info: 'ℹ️',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export function InfoBanner({
  title,
  message,
  icon,
  variant = 'info',
  actionLabel,
  onAction,
  className = '',
}: InfoBannerProps) {
  return (
    <div className={`info-banner info-banner--${variant} ${className}`}>
      <span className="info-banner__icon">{icon || DEFAULT_ICONS[variant]}</span>
      <div className="info-banner__content">
        <div className="info-banner__title">{title}</div>
        <div className="info-banner__message">{message}</div>
        {actionLabel && onAction && (
          <button className="info-banner__action" onClick={onAction}>
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

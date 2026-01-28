import React from 'react';
import './NetworkIndicator.css';

type NetworkStatus = 'online' | 'offline' | 'slow';

interface NetworkIndicatorProps {
  status: NetworkStatus;
  showLabel?: boolean;
}

const STATUS_CONFIG: Record<NetworkStatus, { icon: string; label: string }> = {
  online: { icon: '🟢', label: 'Online' },
  offline: { icon: '🔴', label: 'Offline' },
  slow: { icon: '🟡', label: 'Slow Connection' },
};

export function NetworkIndicator({ status, showLabel = true }: NetworkIndicatorProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className={`network-indicator network-indicator--${status}`}>
      <span className="network-indicator__dot" />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}

interface OfflineBannerProps {
  message?: string;
}

export function OfflineBanner({ message = "You're offline. Some features may be unavailable." }: OfflineBannerProps) {
  return (
    <div className="offline-banner" role="alert">
      <div className="offline-banner__message">
        <span>📡</span>
        <span>{message}</span>
      </div>
    </div>
  );
}

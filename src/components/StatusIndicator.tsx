import React from 'react';
import './StatusIndicator.css';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'pending' | 'error';
  label?: string;
  pulse?: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, pulse = true }) => {
  return (
    <div className="status-indicator">
      <span className={`status-dot status-${status} ${pulse ? 'pulse' : ''}`} />
      {label && <span className="status-label">{label}</span>}
    </div>
  );
};

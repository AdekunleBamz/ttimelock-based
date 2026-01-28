import React from 'react';
import './Pill.css';

interface PillProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  onRemove?: () => void;
}

export const Pill: React.FC<PillProps> = ({ children, variant = 'default', onRemove }) => {
  return (
    <span className={`pill pill-${variant}`}>
      {children}
      {onRemove && (
        <button className="pill-remove" onClick={onRemove} aria-label="Remove">×</button>
      )}
    </span>
  );
};

import React from 'react';
import './HelpText.css';

interface HelpTextProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'error';
}

export const HelpText: React.FC<HelpTextProps> = ({ children, variant = 'info' }) => {
  const icons = { info: 'ℹ️', warning: '⚠️', error: '❌' };

  return (
    <p className={`help-text help-text-${variant}`}>
      <span className="help-icon">{icons[variant]}</span>
      {children}
    </p>
  );
};

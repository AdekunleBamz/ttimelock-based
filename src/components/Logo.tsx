import React from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  return (
    <div className={`logo logo-${size}`}>
      <span className="logo-icon">🔐</span>
      {showText && <span className="logo-text">Timelock Vault</span>}
    </div>
  );
};

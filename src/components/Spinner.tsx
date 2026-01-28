import React from 'react';
import './Spinner.css';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dots' | 'pulse';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', variant = 'default' }) => {
  if (variant === 'dots') {
    return (
      <div className={`spinner-dots spinner-${size}`}>
        <div className="dot" /><div className="dot" /><div className="dot" />
      </div>
    );
  }

  if (variant === 'pulse') {
    return <div className={`spinner-pulse spinner-${size}`} />;
  }

  return <div className={`spinner spinner-${size}`} />;
};

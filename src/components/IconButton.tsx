import React from 'react';
import './IconButton.css';

interface IconButtonProps {
  icon: string;
  onClick: () => void;
  label: string;
  variant?: 'default' | 'primary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  variant = 'default',
  size = 'md',
  disabled = false
}) => {
  return (
    <button
      className={`icon-button icon-button-${variant} icon-button-${size}`}
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

import React from 'react';
import './Input.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, suffix, className = '', ...props }) => {
  return (
    <div className={`input-wrapper ${error ? 'has-error' : ''}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        <input className={`input-field ${className}`} {...props} />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

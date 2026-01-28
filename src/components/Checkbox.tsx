import React from 'react';
import './Checkbox.css';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <label className={`checkbox-wrapper ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={`checkbox-box ${checked ? 'checked' : ''}`}>
        {checked && <span className="checkbox-check">✓</span>}
      </span>
      {label && <span className="checkbox-label">{label}</span>}
    </label>
  );
};

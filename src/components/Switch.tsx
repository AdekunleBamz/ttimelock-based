import React from 'react';
import './Switch.css';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, label, disabled }) => {
  return (
    <label className={`switch-container ${disabled ? 'disabled' : ''}`}>
      {label && <span className="switch-label">{label}</span>}
      <div className="switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="switch-slider" />
      </div>
    </label>
  );
};

import React from 'react';
import './RadioGroup.css';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  name: string;
  direction?: 'horizontal' | 'vertical';
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, name, direction = 'vertical' }) => {
  return (
    <div className={`radio-group radio-${direction}`}>
      {options.map(option => (
        <label key={option.value} className="radio-option">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className={`radio-circle ${value === option.value ? 'checked' : ''}`} />
          <span className="radio-label">{option.label}</span>
        </label>
      ))}
    </div>
  );
};

import React from 'react';
import './TimePicker.css';

interface TimeOption {
  value: number;
  label: string;
  unit: string;
}

interface TimePickerProps {
  value: number;
  onChange: (seconds: number) => void;
  label?: string;
  options?: TimeOption[];
  showUnlockDate?: boolean;
}

const DEFAULT_OPTIONS: TimeOption[] = [
  { value: 3 * 86400, label: '3', unit: 'Days' },
  { value: 7 * 86400, label: '7', unit: 'Days' },
  { value: 14 * 86400, label: '14', unit: 'Days' },
  { value: 30 * 86400, label: '30', unit: 'Days' },
];

export function TimePicker({
  value,
  onChange,
  label = 'Lock Duration',
  options = DEFAULT_OPTIONS,
  showUnlockDate = true,
}: TimePickerProps) {
  const unlockDate = new Date(Date.now() + value * 1000);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="time-picker">
      {label && <label className="time-picker__label">{label}</label>}
      
      <div className="time-picker__options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`time-picker__option ${value === option.value ? 'time-picker__option--selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            <span className="time-picker__option-value">{option.label}</span>
            <span className="time-picker__option-unit">{option.unit}</span>
          </button>
        ))}
      </div>
      
      {showUnlockDate && value > 0 && (
        <div className="time-picker__selected-info">
          Unlocks on <strong>{formatDate(unlockDate)}</strong>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import './Slider.css';

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
  showValue = true
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-wrapper">
      {label && <label className="slider-label">{label}</label>}
      <div className="slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider"
          style={{ background: `linear-gradient(to right, #3b82f6 ${percentage}%, rgba(255,255,255,0.1) ${percentage}%)` }}
        />
        {showValue && <span className="slider-value">{value}</span>}
      </div>
    </div>
  );
};

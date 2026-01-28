import React, { useState } from 'react';
import './GasEstimator.css';

type GasSpeed = 'slow' | 'standard' | 'fast';

interface GasOption {
  speed: GasSpeed;
  label: string;
  gwei: number;
  time: string;
}

interface GasEstimatorProps {
  gasOptions?: GasOption[];
  selectedSpeed?: GasSpeed;
  onSpeedChange?: (speed: GasSpeed) => void;
  estimatedCost?: string;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const DEFAULT_OPTIONS: GasOption[] = [
  { speed: 'slow', label: 'Slow', gwei: 0.001, time: '~5 min' },
  { speed: 'standard', label: 'Standard', gwei: 0.002, time: '~1 min' },
  { speed: 'fast', label: 'Fast', gwei: 0.005, time: '~15 sec' },
];

export function GasEstimator({
  gasOptions = DEFAULT_OPTIONS,
  selectedSpeed = 'standard',
  onSpeedChange,
  estimatedCost = '~$0.01',
  onRefresh,
  isLoading = false,
}: GasEstimatorProps) {
  const [selected, setSelected] = useState<GasSpeed>(selectedSpeed);

  const handleSelect = (speed: GasSpeed) => {
    setSelected(speed);
    onSpeedChange?.(speed);
  };

  return (
    <div className="gas-estimator">
      <div className="gas-estimator__header">
        <span className="gas-estimator__title">⛽ Gas Settings</span>
        {onRefresh && (
          <button 
            className="gas-estimator__refresh" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        )}
      </div>

      <div className="gas-estimator__options">
        {gasOptions.map((option) => (
          <button
            key={option.speed}
            className={`gas-estimator__option ${selected === option.speed ? 'gas-estimator__option--selected' : ''}`}
            onClick={() => handleSelect(option.speed)}
          >
            <span className="gas-estimator__option-label">{option.label}</span>
            <span className="gas-estimator__option-value">{option.gwei} Gwei</span>
            <span className="gas-estimator__option-time">{option.time}</span>
          </button>
        ))}
      </div>

      <div className="gas-estimator__estimate">
        <span className="gas-estimator__estimate-label">Estimated Cost</span>
        <span className="gas-estimator__estimate-value">{estimatedCost}</span>
      </div>
    </div>
  );
}

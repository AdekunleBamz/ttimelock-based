import "./LockOptionsDisplay.css";

interface LockOption {
  duration: number;
  label: string;
  multiplier?: number;
}

interface LockOptionsDisplayProps {
  options: LockOption[];
  selectedDuration: number;
  onSelect: (duration: number) => void;
  disabled?: boolean;
}

const getDurationBenefits = (days: number): string => {
  if (days >= 30) return "Maximum discipline bonus";
  if (days >= 14) return "Strong commitment";
  if (days >= 7) return "Standard lock";
  return "Quick lock";
};

export function LockOptionsDisplay({
  options,
  selectedDuration,
  onSelect,
  disabled,
}: LockOptionsDisplayProps) {
  return (
    <div className="lock-options-display">
      <h3 className="options-title">⏱️ Lock Duration Options</h3>
      <p className="options-subtitle">
        Choose how long to lock your USDC. Longer locks build better savings habits!
      </p>

      <div className="options-grid">
        {options.map((option) => {
          const days = Math.floor(option.duration / 86400);
          const isSelected = selectedDuration === option.duration;

          return (
            <button
              key={option.duration}
              className={`option-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(option.duration)}
              disabled={disabled}
            >
              <div className="option-duration">
                <span className="duration-number">{days}</span>
                <span className="duration-unit">Days</span>
              </div>
              <div className="option-details">
                <span className="option-label">{option.label}</span>
                <span className="option-benefit">{getDurationBenefits(days)}</span>
              </div>
              {isSelected && <span className="selected-check">✓</span>}
            </button>
          );
        })}
      </div>

      <div className="lock-info">
        <div className="info-item">
          <span className="info-icon">💡</span>
          <span>Early withdrawal incurs a 10% penalty fee</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🔒</span>
          <span>Funds are locked until the unlock date</span>
        </div>
      </div>
    </div>
  );
}

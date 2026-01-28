import "./ProgressBar.css";

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: "default" | "warning" | "danger" | "success";
}

export function ProgressBar({ value, max = 100, variant = "default" }: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="progress-bar-container">
      <div
        className={`progress-bar-fill ${variant}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

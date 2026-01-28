import "./LoadingSpinner.css";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = "medium", 
  color = "#4a9eff",
  text 
}: LoadingSpinnerProps) {
  const sizeMap = {
    small: 16,
    medium: 32,
    large: 48,
  };

  const dimension = sizeMap[size];

  return (
    <div className="loading-spinner-container">
      <div 
        className="loading-spinner" 
        style={{ 
          width: dimension, 
          height: dimension,
          borderColor: `${color}22`,
          borderTopColor: color,
        }} 
      />
      {text && <span className="loading-spinner-text">{text}</span>}
    </div>
  );
}

import React from 'react';
import './InfoRow.css';

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  tooltip?: string;
}

export const InfoRow: React.FC<InfoRowProps> = ({ label, value, tooltip }) => {
  return (
    <div className="info-row">
      <span className="info-label" title={tooltip}>{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
};

import React from 'react';

interface TruncateProps {
  text: string;
  maxLength?: number;
  showTooltip?: boolean;
}

export const Truncate: React.FC<TruncateProps> = ({ text, maxLength = 20, showTooltip = true }) => {
  if (text.length <= maxLength) return <span>{text}</span>;
  
  const truncated = `${text.slice(0, maxLength)}...`;
  
  return (
    <span title={showTooltip ? text : undefined} style={{ cursor: showTooltip ? 'help' : 'default' }}>
      {truncated}
    </span>
  );
};

export const truncateAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

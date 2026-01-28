import React from 'react';

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const sizes = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const Spacer: React.FC<SpacerProps> = ({ size = 'md' }) => {
  return <div style={{ height: sizes[size], width: '100%' }} />;
};

import React, { useMemo } from 'react';
import './WalletAvatar.css';

interface WalletAvatarProps {
  address: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Simple blockie-style color generator
function generateColors(address: string): string[] {
  const seed = address.toLowerCase();
  const colors: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const hash = seed.slice(2 + i * 10, 12 + i * 10);
    const r = parseInt(hash.slice(0, 2), 16) || 100;
    const g = parseInt(hash.slice(2, 4), 16) || 100;
    const b = parseInt(hash.slice(4, 6), 16) || 100;
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }
  
  return colors;
}

export function WalletAvatar({ address, size = 'md', className = '' }: WalletAvatarProps) {
  const colors = useMemo(() => generateColors(address), [address]);
  
  const gradient = `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`;
  
  return (
    <div 
      className={`wallet-avatar wallet-avatar--${size} ${className}`}
      style={{ background: gradient }}
      title={address}
    >
      <span className="wallet-avatar__fallback">
        {address.slice(2, 4).toUpperCase()}
      </span>
    </div>
  );
}

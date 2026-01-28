import React from 'react';
import './NetworkSwitcher.css';

interface NetworkSwitcherProps {
  currentChainId: number;
  onSwitch: (chainId: number) => void;
}

const networks = [
  { id: 8453, name: 'Base', icon: '🔵' },
  { id: 84532, name: 'Base Sepolia', icon: '🟣' },
];

export const NetworkSwitcher: React.FC<NetworkSwitcherProps> = ({ currentChainId, onSwitch }) => {
  return (
    <div className="network-switcher">
      {networks.map(network => (
        <button
          key={network.id}
          className={`network-option ${currentChainId === network.id ? 'active' : ''}`}
          onClick={() => onSwitch(network.id)}
        >
          <span>{network.icon}</span>
          <span>{network.name}</span>
        </button>
      ))}
    </div>
  );
};

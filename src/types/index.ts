// Core application types

export interface WalletInfo {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  isCorrectChain: boolean;
  error: string | null;
  ethBalance?: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchToBase: () => Promise<void>;
}

export interface DepositInfo {
  id: number;
  principal: bigint;
  principalFormatted: string;
  startTime: Date;
  unlockTime: Date;
  withdrawn: boolean;
  isUnlocked: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'pending';
  title: string;
  message?: string;
}

export interface LockOption {
  days: number;
  label: string;
  description: string;
}

export const LOCK_OPTIONS: LockOption[] = [
  { days: 3, label: '3 Days', description: 'Short-term savings' },
  { days: 7, label: '1 Week', description: 'Weekly goal' },
  { days: 14, label: '2 Weeks', description: 'Bi-weekly savings' },
  { days: 30, label: '1 Month', description: 'Monthly discipline' },
];

export const CHAIN_CONFIG = {
  BASE_CHAIN_ID: 8453,
  BASE_RPC_URL: 'https://mainnet.base.org',
  USDC_ADDRESS: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
} as const;

export type NetworkStatus = 'connected' | 'disconnected' | 'wrong-chain';

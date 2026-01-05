// Deployed contract addresses on Base Mainnet
export const CONTRACTS = {
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  LOCK_OPTIONS: "0x305e57b81b5A846a5De7F77322ac4BC12CDc806D",
  VAULT_TREASURY: "0x127881a076F7027bB36aE2c25E0571f631EDCB4e",
  TIMELOCK_VAULT: "0xCa7dc1f1E5B5F2334ad46fb7A5D3C8B450D105FD",
  VAULT_ROUTER: "0x7bf78156c26C88a8f0f8dA129208FBD39a38dE0a",
} as const;

// Base Mainnet chain config
export const BASE_MAINNET = {
  chainId: 8453,
  chainIdHex: "0x2105",
  name: "Base",
  rpcUrl: "https://mainnet.base.org",
  blockExplorer: "https://basescan.org",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
};

// Lock duration options (in seconds)
export const LOCK_DURATIONS = [
  { label: "3 Days", value: 259200 },
  { label: "7 Days", value: 604800 },
  { label: "14 Days", value: 1209600 },
  { label: "30 Days", value: 2592000 },
];

// USDC has 6 decimals
export const USDC_DECIMALS = 6;

// Minimum deposit: 0.1 USDC = 100000 (6 decimals)
export const MIN_DEPOSIT = 0.1;

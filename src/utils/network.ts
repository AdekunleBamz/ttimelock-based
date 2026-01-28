export const BASE_CHAIN_ID = 8453;
export const BASE_SEPOLIA_CHAIN_ID = 84532;

export const NETWORKS = {
  [BASE_CHAIN_ID]: {
    name: 'Base',
    rpcUrl: 'https://mainnet.base.org',
    explorer: 'https://basescan.org',
    currency: 'ETH',
  },
  [BASE_SEPOLIA_CHAIN_ID]: {
    name: 'Base Sepolia',
    rpcUrl: 'https://sepolia.base.org',
    explorer: 'https://sepolia.basescan.org',
    currency: 'ETH',
  },
};

export const getExplorerUrl = (chainId: number, txHash: string): string => {
  const network = NETWORKS[chainId as keyof typeof NETWORKS];
  return network ? `${network.explorer}/tx/${txHash}` : '';
};

export const getAddressUrl = (chainId: number, address: string): string => {
  const network = NETWORKS[chainId as keyof typeof NETWORKS];
  return network ? `${network.explorer}/address/${address}` : '';
};

export const isCorrectNetwork = (chainId: number): boolean => {
  return chainId === BASE_CHAIN_ID || chainId === BASE_SEPOLIA_CHAIN_ID;
};

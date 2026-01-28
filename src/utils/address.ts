// Address validation and formatting utilities

const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

export function isValidAddress(address: string): boolean {
  return ETH_ADDRESS_REGEX.test(address);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function checksumAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  
  // Simple checksum implementation
  const lowercaseAddress = address.toLowerCase().replace('0x', '');
  let checksummed = '0x';
  
  // This is a simplified version - in production use ethers.getAddress
  for (let i = 0; i < lowercaseAddress.length; i++) {
    const char = lowercaseAddress[i];
    if (/[a-f]/.test(char)) {
      // For a proper implementation, you'd hash the address first
      checksummed += i % 2 === 0 ? char.toUpperCase() : char;
    } else {
      checksummed += char;
    }
  }
  
  return checksummed;
}

export function isSameAddress(a: string | null, b: string | null): boolean {
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
}

export function maskAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.slice(0, 6)}${'•'.repeat(6)}${address.slice(-4)}`;
}

export function getAddressExplorerUrl(address: string, network = 'base'): string {
  const explorers: Record<string, string> = {
    base: 'https://basescan.org/address/',
    ethereum: 'https://etherscan.io/address/',
    sepolia: 'https://sepolia.etherscan.io/address/',
  };
  return `${explorers[network] || explorers.base}${address}`;
}

export function getTxExplorerUrl(txHash: string, network = 'base'): string {
  const explorers: Record<string, string> = {
    base: 'https://basescan.org/tx/',
    ethereum: 'https://etherscan.io/tx/',
    sepolia: 'https://sepolia.etherscan.io/tx/',
  };
  return `${explorers[network] || explorers.base}${txHash}`;
}

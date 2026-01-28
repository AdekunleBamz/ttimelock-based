export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const isValidAmount = (amount: string): boolean => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

export const isValidDuration = (days: number): boolean => {
  return Number.isInteger(days) && days >= 1 && days <= 365;
};

export const sanitizeInput = (input: string): string => {
  return input.replace(/[<>\"'&]/g, '');
};

export const validateDepositInput = (amount: string, balance: string): { valid: boolean; error?: string } => {
  if (!amount || amount === '0') return { valid: false, error: 'Enter an amount' };
  const amountNum = parseFloat(amount);
  const balanceNum = parseFloat(balance);
  if (isNaN(amountNum)) return { valid: false, error: 'Invalid amount' };
  if (amountNum <= 0) return { valid: false, error: 'Amount must be positive' };
  if (amountNum > balanceNum) return { valid: false, error: 'Insufficient balance' };
  return { valid: true };
};

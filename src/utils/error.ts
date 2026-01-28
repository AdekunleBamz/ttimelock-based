export const parseError = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
};

export const isUserRejection = (error: unknown): boolean => {
  const message = parseError(error).toLowerCase();
  return message.includes('user rejected') || message.includes('user denied');
};

export const getContractError = (error: unknown): string => {
  const message = parseError(error);
  if (message.includes('insufficient funds')) return 'Insufficient funds for transaction';
  if (message.includes('execution reverted')) return 'Transaction failed - contract rejected';
  if (isUserRejection(error)) return 'Transaction cancelled';
  return message;
};

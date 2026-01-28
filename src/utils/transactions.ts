// Transaction history management

export interface TransactionRecord {
  hash: string;
  type: 'deposit' | 'withdraw' | 'emergency_withdraw' | 'approve';
  amount?: string;
  depositId?: number;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
}

const TX_STORAGE_KEY = 'timevault_transactions';
const MAX_TRANSACTIONS = 50;

export function getTransactionHistory(): TransactionRecord[] {
  try {
    const stored = localStorage.getItem(TX_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addTransaction(tx: Omit<TransactionRecord, 'timestamp'>): void {
  const history = getTransactionHistory();
  const newTx: TransactionRecord = {
    ...tx,
    timestamp: Date.now(),
  };
  
  const updated = [newTx, ...history].slice(0, MAX_TRANSACTIONS);
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
}

export function updateTransactionStatus(
  hash: string, 
  status: TransactionRecord['status'],
  blockNumber?: number
): void {
  const history = getTransactionHistory();
  const updated = history.map(tx => 
    tx.hash === hash ? { ...tx, status, blockNumber } : tx
  );
  localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(updated));
}

export function getPendingTransactions(): TransactionRecord[] {
  return getTransactionHistory().filter(tx => tx.status === 'pending');
}

export function getRecentTransactions(count = 10): TransactionRecord[] {
  return getTransactionHistory().slice(0, count);
}

export function clearTransactionHistory(): void {
  localStorage.removeItem(TX_STORAGE_KEY);
}

export function getTransactionsByType(type: TransactionRecord['type']): TransactionRecord[] {
  return getTransactionHistory().filter(tx => tx.type === type);
}

export function formatTransactionType(type: TransactionRecord['type']): string {
  const labels: Record<TransactionRecord['type'], string> = {
    deposit: 'Deposit',
    withdraw: 'Withdrawal',
    emergency_withdraw: 'Emergency Withdrawal',
    approve: 'Token Approval',
  };
  return labels[type];
}

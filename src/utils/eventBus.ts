// Event emitter for cross-component communication

type EventCallback<T = unknown> = (data: T) => void;

class EventBus {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  on<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback as EventCallback);
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off<T = unknown>(event: string, callback: EventCallback<T>): void {
    this.listeners.get(event)?.delete(callback as EventCallback);
  }

  emit<T = unknown>(event: string, data?: T): void {
    this.listeners.get(event)?.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for "${event}":`, error);
      }
    });
  }

  once<T = unknown>(event: string, callback: EventCallback<T>): () => void {
    const wrapper: EventCallback<T> = (data) => {
      this.off(event, wrapper);
      callback(data);
    };
    return this.on(event, wrapper);
  }

  clear(event?: string): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  listenerCount(event: string): number {
    return this.listeners.get(event)?.size ?? 0;
  }
}

export const eventBus = new EventBus();

// Typed events for the application
export const AppEvents = {
  WALLET_CONNECTED: 'wallet:connected',
  WALLET_DISCONNECTED: 'wallet:disconnected',
  DEPOSIT_CREATED: 'deposit:created',
  DEPOSIT_WITHDRAWN: 'deposit:withdrawn',
  NETWORK_CHANGED: 'network:changed',
  TRANSACTION_PENDING: 'tx:pending',
  TRANSACTION_CONFIRMED: 'tx:confirmed',
  TRANSACTION_FAILED: 'tx:failed',
} as const;

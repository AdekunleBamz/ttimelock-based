// Analytics utility for tracking user interactions

type EventCategory = 'wallet' | 'deposit' | 'withdraw' | 'navigation' | 'error';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  timestamp: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  track(category: EventCategory, action: string, label?: string, value?: number): void {
    const event: AnalyticsEvent = {
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
    };
    
    this.events.push(event);
    
    // Log in development
    if (import.meta.env.DEV) {
      console.log('[Analytics]', event);
    }
  }

  trackWalletConnect(address: string): void {
    this.track('wallet', 'connect', address.slice(0, 10));
  }

  trackWalletDisconnect(): void {
    this.track('wallet', 'disconnect');
  }

  trackDeposit(amount: number, duration: number): void {
    this.track('deposit', 'create', `${duration}days`, amount);
  }

  trackWithdraw(depositId: number, isEmergency: boolean): void {
    this.track('withdraw', isEmergency ? 'emergency' : 'normal', `deposit-${depositId}`);
  }

  trackError(error: string, context?: string): void {
    this.track('error', error, context);
  }

  getSessionEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const analytics = new Analytics();

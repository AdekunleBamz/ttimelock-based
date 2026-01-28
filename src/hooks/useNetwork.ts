import { useState, useEffect } from 'react';

type ConnectionStatus = 'online' | 'offline' | 'slow';

interface NetworkState {
  status: ConnectionStatus;
  isOnline: boolean;
  isOffline: boolean;
  isSlow: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

interface NetworkInformation extends EventTarget {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
}

declare global {
  interface Navigator {
    connection?: NetworkInformation;
  }
}

export function useNetwork(): NetworkState {
  const [state, setState] = useState<NetworkState>(() => ({
    status: navigator.onLine ? 'online' : 'offline',
    isOnline: navigator.onLine,
    isOffline: !navigator.onLine,
    isSlow: false,
  }));

  useEffect(() => {
    const updateNetworkState = () => {
      const connection = navigator.connection;
      const isOnline = navigator.onLine;
      
      let status: ConnectionStatus = isOnline ? 'online' : 'offline';
      let isSlow = false;

      if (isOnline && connection) {
        // Check for slow connection
        const effectiveType = connection.effectiveType;
        if (effectiveType === '2g' || effectiveType === 'slow-2g') {
          status = 'slow';
          isSlow = true;
        }
      }

      setState({
        status,
        isOnline,
        isOffline: !isOnline,
        isSlow,
        effectiveType: connection?.effectiveType,
        downlink: connection?.downlink,
        rtt: connection?.rtt,
      });
    };

    updateNetworkState();

    window.addEventListener('online', updateNetworkState);
    window.addEventListener('offline', updateNetworkState);
    navigator.connection?.addEventListener('change', updateNetworkState);

    return () => {
      window.removeEventListener('online', updateNetworkState);
      window.removeEventListener('offline', updateNetworkState);
      navigator.connection?.removeEventListener('change', updateNetworkState);
    };
  }, []);

  return state;
}

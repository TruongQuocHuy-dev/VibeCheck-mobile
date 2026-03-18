import NetInfo from '@react-native-community/netinfo';
import React, { createContext, useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../hooks/useToast';

type NetworkContextValue = {
  isOnline: boolean;
};

export const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

type NetworkProviderProps = {
  children: React.ReactNode;
};

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isOnline, setIsOnline] = useState(true);
  const hasMountedRef = useRef(false);
  const prevOnlineRef = useRef<boolean | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const nextIsOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(nextIsOnline);

      if (!hasMountedRef.current) {
        hasMountedRef.current = true;
        prevOnlineRef.current = nextIsOnline;
        return;
      }

      if (prevOnlineRef.current !== nextIsOnline) {
        if (!nextIsOnline) {
          showToast('Khong co ket noi mang', 'error', 2600);
        } else {
          showToast('Da ket noi lai mang', 'success', 1800);
        }
      }

      prevOnlineRef.current = nextIsOnline;
    });

    return () => {
      unsubscribe();
    };
  }, [showToast]);

  const value = useMemo(() => ({ isOnline }), [isOnline]);

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

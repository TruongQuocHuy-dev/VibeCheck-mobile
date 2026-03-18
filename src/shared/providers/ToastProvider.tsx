import React, { createContext, useCallback, useMemo, useRef, useState } from 'react';
import { ToastPayload, ToastView } from '../components/feedback/Toast';

type ToastType = ToastPayload['type'];

type ToastContextValue = {
  showToast: (message: string, type?: ToastType, durationMs?: number) => void;
  hideToast: () => void;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [toast, setToast] = useState<ToastPayload | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', durationMs = 2200) => {
      clearTimer();
      setToast({ message, type });
      setVisible(true);

      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, durationMs);
    },
    [clearTimer],
  );

  const value = useMemo(
    () => ({
      showToast,
      hideToast,
    }),
    [hideToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastView visible={visible} toast={toast} />
    </ToastContext.Provider>
  );
};

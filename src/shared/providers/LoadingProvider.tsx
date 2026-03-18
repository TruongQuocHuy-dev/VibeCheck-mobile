import React, { createContext, useMemo, useState } from 'react';
import { LoadingOverlay } from '../components/feedback/Loading';

type LoadingContextValue = {
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  isLoading: boolean;
};

export const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

type LoadingProviderProps = {
  children: React.ReactNode;
};

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | undefined>();

  const value = useMemo(
    () => ({
      showLoading: (nextMessage?: string) => {
        setMessage(nextMessage);
        setIsLoading(true);
      },
      hideLoading: () => {
        setIsLoading(false);
        setMessage(undefined);
      },
      isLoading,
    }),
    [isLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={isLoading} message={message} />
    </LoadingContext.Provider>
  );
};

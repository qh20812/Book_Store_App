'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loading from '../components/ui/loading';

interface LoadingContextType {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);
  const setLoading = (loading: boolean) => setIsLoading(loading);

  return (
    <LoadingContext.Provider value={{ isLoading, showLoading, hideLoading, setLoading }}>
      {children}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loading type="spinner" size="xl" />
            <p className="text-white text-lg font-semibold">Loading...</p>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};

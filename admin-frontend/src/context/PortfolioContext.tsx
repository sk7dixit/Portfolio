import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useStore } from '../store/useStore';

interface PortfolioInfo {
  slug: string;
  name: string;
}

interface PortfolioContextType {
  activePortfolio: string;
  setActivePortfolio: (slug: string) => void;
  availablePortfolios: PortfolioInfo[];
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const availablePortfolios: PortfolioInfo[] = [
  { slug: 'shashwat', name: 'Shashwat' },
  { slug: 'mahi', name: 'Mahi' },
  { slug: 'khushaboo', name: 'Khushaboo' },
];

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [activePortfolio, setActivePortfolioState] = useState<string>(() => {
    return localStorage.getItem('active_portfolio_slug') || 'shashwat';
  });

  const fetchEverything = useStore((state) => state.fetchEverything);

  const setActivePortfolio = async (slug: string) => {
    localStorage.setItem('active_portfolio_slug', slug);
    setActivePortfolioState(slug);
    
    // Trigger store re-fetch to reload all data under the new portfolio slug header
    await fetchEverything();
  };

  return (
    <PortfolioContext.Provider
      value={{
        activePortfolio,
        setActivePortfolio,
        availablePortfolios,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}

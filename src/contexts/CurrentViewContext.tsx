
import React, { createContext, useContext } from 'react';

interface CurrentViewContextType {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const CurrentViewContext = createContext<CurrentViewContextType | undefined>(undefined);

export const CurrentViewProvider: React.FC<{
  value: CurrentViewContextType;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <CurrentViewContext.Provider value={value}>
      {children}
    </CurrentViewContext.Provider>
  );
};

export const useCurrentView = () => {
  const context = useContext(CurrentViewContext);
  if (context === undefined) {
    throw new Error('useCurrentView must be used within a CurrentViewProvider');
  }
  return context;
};

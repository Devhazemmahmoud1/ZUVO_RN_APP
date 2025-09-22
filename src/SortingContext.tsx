// SortingContext.tsx
import React, { createContext, useState, useContext } from "react";

type SortingType = "price_asc" | "price_desc" | "newest" | "popular";

interface SortingContextProps {
  sorting: SortingType;
  setSorting: (value: SortingType) => void;
}

const SortingContext = createContext<SortingContextProps | undefined>(undefined);

export const SortingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sorting, setSorting] = useState<SortingType>("newest"); // default

  return (
    <SortingContext.Provider value={{ sorting, setSorting }}>
      {children}
    </SortingContext.Provider>
  );
};

export const useSorting = () => {
  const context = useContext(SortingContext);
  if (!context) throw new Error("useSorting must be used within SortingProvider");
  return context;
};

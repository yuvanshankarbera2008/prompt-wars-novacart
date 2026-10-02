import React, { createContext, useContext, useState, useEffect } from 'react';

const SavedShopsContext = createContext();

export function SavedShopsProvider({ children }) {
  const [savedStoreIds, setSavedStoreIds] = useState(() => {
    const saved = localStorage.getItem('nova_saved_shops');
    // Default saved stores for a warm starting experience
    return saved ? JSON.parse(saved) : ['store-blr-01', 'store-blr-02'];
  });

  useEffect(() => {
    localStorage.setItem('nova_saved_shops', JSON.stringify(savedStoreIds));
  }, [savedStoreIds]);

  const toggleSaveStore = (storeId) => {
    setSavedStoreIds(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId);
      } else {
        return [...prev, storeId];
      }
    });
  };

  const isStoreSaved = (storeId) => savedStoreIds.includes(storeId);

  return (
    <SavedShopsContext.Provider
      value={{
        savedStoreIds,
        toggleSaveStore,
        isStoreSaved
      }}
    >
      {children}
    </SavedShopsContext.Provider>
  );
}

export function useSavedShops() {
  const context = useContext(SavedShopsContext);
  if (!context) throw new Error('useSavedShops must be used within SavedShopsProvider');
  return context;
}

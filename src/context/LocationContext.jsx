import React, { createContext, useContext, useState, useEffect } from 'react';
import initialAddresses from '../data/addresses.json';

const LocationContext = createContext();

// Calculate distance in kilometers using the Haversine formula
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 2.5; // realistic fallback
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function LocationProvider({ children }) {
  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem('nova_addresses');
    return saved ? JSON.parse(saved) : initialAddresses;
  });

  const [currentAddress, setCurrentAddress] = useState(() => {
    const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
    return defaultAddr;
  });

  const [selectedCity, setSelectedCity] = useState(currentAddress.city || 'Bengaluru');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_addresses', JSON.stringify(savedAddresses));
  }, [savedAddresses]);

  const selectAddress = (address) => {
    setCurrentAddress(address);
    setSelectedCity(address.city);
    setIsLocationModalOpen(false);
  };

  const addNewAddress = (newAddr) => {
    const created = {
      id: `addr-${Date.now()}`,
      isDefault: false,
      ...newAddr
    };
    setSavedAddresses(prev => [created, ...prev]);
    setCurrentAddress(created);
    setSelectedCity(created.city);
    setIsLocationModalOpen(false);
  };

  const detectCurrentLocation = () => {
    // Simulated realistic GPS detection
    const detected = {
      id: `addr-gps-${Date.now()}`,
      label: 'Current GPS Location',
      tag: 'Live GPS',
      name: 'Current Location',
      phone: '+91 98450 12345',
      flat: 'Near Metro Pillar 114',
      street: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      lat: 12.9730,
      lng: 77.6430,
      isDefault: false
    };
    setSavedAddresses(prev => [detected, ...prev]);
    setCurrentAddress(detected);
    setSelectedCity('Bengaluru');
    setIsLocationModalOpen(false);
  };

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        currentAddress,
        savedAddresses,
        selectAddress,
        addNewAddress,
        detectCurrentLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        calculateDistanceKm
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) throw new Error('useLocation must be used within LocationProvider');
  return context;
}

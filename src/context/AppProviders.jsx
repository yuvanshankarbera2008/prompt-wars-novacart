import React from 'react';
import { AuthProvider } from './AuthContext';
import { LocationProvider } from './LocationContext';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import { SavedShopsProvider } from './SavedShopsContext';
import { RewardsProvider } from './RewardsContext';
import { AdminProvider } from './AdminContext';

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <LocationProvider>
        <CartProvider>
          <OrderProvider>
            <SavedShopsProvider>
              <RewardsProvider>
                <AdminProvider>
                  {children}
                </AdminProvider>
              </RewardsProvider>
            </SavedShopsProvider>
          </OrderProvider>
        </CartProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

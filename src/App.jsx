import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProviders } from './context/AppProviders';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { WelcomeModal } from './components/WelcomeModal';
import { LocationModal } from './components/LocationModal';
import { ToastContainer } from './components/ToastContainer';
import { SearchModal } from './components/SearchModal';
import { SupportChatWidget } from './components/SupportChatWidget';

import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { StoresPage } from './pages/StoresPage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { CartPage } from './pages/CartPage';
import { TrackingPage } from './pages/TrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { RewardsPage } from './pages/RewardsPage';
import { SavedShopsPage } from './pages/SavedShopsPage';
import { SupportPage } from './pages/SupportPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <BrowserRouter>
      <AppProviders>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
          <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
          
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/stores" element={<StoresPage />} />
              <Route path="/store/:storeId" element={<StoreDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/tracking/:orderId" element={<TrackingPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/saved-shops" element={<SavedShopsPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          <BottomNav />
          <WelcomeModal />
          <LocationModal />
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
          <SupportChatWidget />
          <ToastContainer />
        </div>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;

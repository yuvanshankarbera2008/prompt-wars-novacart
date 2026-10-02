import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  MapPin, 
  Search, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  HelpCircle, 
  LayoutDashboard,
  Heart,
  Gift,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation as useAppLocation } from '../context/LocationContext';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';

export function Navbar({ onOpenSearch }) {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const { user, logout, showWelcomeModal } = useAuth();
  const { currentAddress, selectedCity, setIsLocationModalOpen } = useAppLocation();
  const { totalItemsCount, itemTotal } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 3-token free delivery tracker icons
  const tokensLeft = user?.freeDeliveryTokens ?? 3;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top micro banner for Welcome / Free delivery reminder */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-900 text-white text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-bold border border-amber-400/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              NEW CUSTOMER PERK
            </span>
            <span className="hidden sm:inline">50% OFF your first order + FREE delivery on first 3 orders!</span>
            <span className="sm:hidden">50% OFF + 3 Free Deliveries!</span>
          </div>

          {/* 3-Icon Free Delivery Token Tracker in top bar */}
          <div className="flex items-center gap-2 text-slate-200 text-[11px]">
            <span className="hidden md:inline font-medium">Free Delivery Wallet:</span>
            <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full border border-white/15" title={`${tokensLeft} of 3 free deliveries remaining`}>
              {[1, 2, 3].map((tokenNum) => (
                <Truck
                  key={tokenNum}
                  className={`w-3.5 h-3.5 transition-colors ${
                    tokenNum <= tokensLeft ? 'text-emerald-400 drop-shadow-xs' : 'text-slate-500 opacity-40'
                  }`}
                />
              ))}
              <span className="ml-1 text-[11px] font-semibold text-emerald-300">{tokensLeft}/3 Left</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-900 via-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-700/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black tracking-tighter">⚡</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-950 via-brand-800 to-indigo-700 bg-clip-text text-transparent">
                  NOVA CART
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                  Antigravity
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-700 -mt-0.5">Reliable Local Quick-Commerce</p>
            </div>
          </Link>

          {/* Location Selector Button */}
          <button
            onClick={() => setIsLocationModalOpen(true)}
            id="location-selector-btn"
            className="hidden sm:flex items-center gap-2 text-left px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <span>{currentAddress?.label || 'Select Location'}</span>
                <span className="text-[11px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.2 rounded">
                  {selectedCity}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-700 truncate max-w-[210px]">
                {currentAddress ? `${currentAddress.street}, ${currentAddress.pincode}` : 'Click to choose address'}
              </p>
            </div>
          </button>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-100/90 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-700" />
              <span className="text-slate-700 font-medium">Search "Amul milk", "Atta", "Bakery"...</span>
            </div>
            <span className="text-[11px] font-semibold bg-white border border-slate-200 px-2 py-0.5 rounded text-slate-700 shadow-2xs">
              ⌘K
            </span>
          </button>
        </div>

        {/* Actions & Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/saved-shops"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              routerLocation.pathname === '/saved-shops' ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>My Shops</span>
          </Link>

          <Link
            to="/rewards"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              routerLocation.pathname === '/rewards' ? 'bg-amber-50 text-amber-800' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-700" />
            <span>Rewards</span>
          </Link>

          <Link
            to="/admin"
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors border border-slate-200/80"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-slate-600" />
            <span>Admin / Store</span>
          </Link>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              id="user-profile-btn"
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 font-medium text-sm transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {user?.name?.split(' ')[0] || 'My Account'}
                </span>
                <span className="block text-[10px] text-emerald-600 font-semibold">
                  {user?.loyaltyTier || 'Nova Member'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
                  <p className="text-xs font-semibold text-slate-500">Logged in as</p>
                  <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md">
                      {user?.loyaltyTier}
                    </span>
                    <span className="text-[11px] text-amber-600 font-bold">
                      {user?.loyaltyPoints} Coins
                    </span>
                  </div>
                </div>

                <div className="py-1 text-sm font-medium">
                  <Link to="/orders" className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50">
                    <Truck className="w-4 h-4 text-slate-400" />
                    <span>My Orders & Tracking</span>
                  </Link>
                  <Link to="/rewards" className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span>Scratch Cards & Rewards</span>
                  </Link>
                  <Link to="/saved-shops" className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>My Neighbourhood Shops</span>
                  </Link>
                  <Link to="/support" className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50">
                    <HelpCircle className="w-4 h-4 text-brand-500" />
                    <span>Help & Ticket Resolution</span>
                  </Link>
                  <Link to="/admin" className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                    <span>Admin Dashboard</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <Link to="/login" className="flex items-center gap-2.5 px-4 py-2 text-slate-600 hover:bg-slate-50 text-sm font-medium">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>Switch / Register New Account</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-rose-600 hover:bg-rose-50 text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart Trigger Button */}
          <Link
            to="/cart"
            id="nav-cart-btn"
            className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-sm shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-emerald-600">
                  {totalItemsCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[10px] text-emerald-100 font-semibold">
                {totalItemsCount === 0 ? 'Empty' : `${totalItemsCount} Items`}
              </span>
              <span className="text-xs font-black">
                {totalItemsCount === 0 ? 'My Cart' : formatINR(itemTotal)}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

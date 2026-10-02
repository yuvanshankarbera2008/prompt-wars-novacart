import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Store, Gift, Truck, HelpCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function BottomNav() {
  const { totalItemsCount } = useCart();

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/stores', label: 'Stores', icon: Store },
    { to: '/rewards', label: 'Rewards', icon: Gift },
    { to: '/orders', label: 'Orders', icon: Truck },
    { to: '/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive
                  ? 'text-brand-600 font-bold'
                  : 'text-slate-500 font-medium hover:text-slate-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  {to === '/orders' && totalItemsCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

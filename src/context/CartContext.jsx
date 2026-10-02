import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('nova_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [substituteOptions, setSubstituteOptions] = useState({}); // productId -> 'similar' | 'ask' | 'remove'
  const [showCelebration2k, setShowCelebration2k] = useState(false);
  const [hasCelebrated2kForSession, setHasCelebrated2kForSession] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, store) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, store, quantity: 1 }];
    });

    // Default substitute setting to 'similar'
    if (!substituteOptions[product.id]) {
      setSubstituteOptions(prev => ({ ...prev, [product.id]: 'similar' }));
    }
  };

  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const setSubstitutePreference = (productId, preference) => {
    setSubstituteOptions(prev => ({
      ...prev,
      [productId]: preference
    }));
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
    setHasCelebrated2kForSession(false);
  };

  const applyCoupon = (coupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Calculations
  const itemTotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // ₹2,000 Free Delivery Rule Check & Celebration
  const isFreeDeliveryBy2k = itemTotal >= 2000;
  const amountNeededFor2k = Math.max(0, 2000 - itemTotal);

  useEffect(() => {
    if (isFreeDeliveryBy2k && !hasCelebrated2kForSession && itemTotal > 0) {
      setShowCelebration2k(true);
      setHasCelebrated2kForSession(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fallback
      }
    } else if (!isFreeDeliveryBy2k && hasCelebrated2kForSession) {
      setHasCelebrated2kForSession(false);
    }
  }, [isFreeDeliveryBy2k, hasCelebrated2kForSession, itemTotal]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        itemTotal,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        substituteOptions,
        setSubstitutePreference,
        isFreeDeliveryBy2k,
        amountNeededFor2k,
        showCelebration2k,
        setShowCelebration2k
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

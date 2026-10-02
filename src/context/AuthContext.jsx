import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEFAULT_USER = {
  id: 'user-001',
  name: 'Yuvan Sharma',
  phone: '9845012345',
  email: 'yuvan@example.com',
  city: 'Bengaluru',
  isNewUser: false,
  freeDeliveryTokens: 3, // Default 3 free deliveries for every user
  hasUsedFirstOrderDiscount: false,
  referralCode: 'NOVA-YUVAN-26',
  influencerCode: '',
  walletBalance: 0,
  loyaltyTier: 'Nova Member', // Nova Member -> Silver -> Gold
  loyaltyPoints: 120,
  deliveredOrdersCount: 0,
  lastOrderDate: null,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('nova_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeBannerDismissed, setWelcomeBannerDismissed] = useState(false);

  useEffect(() => {
    localStorage.setItem('nova_user', JSON.stringify(user));
  }, [user]);

  // Login handler
  const login = (identifier, password, method = 'password') => {
    // Simulated successful login
    const updatedUser = {
      ...user,
      email: identifier.includes('@') ? identifier : user.email,
      phone: !identifier.includes('@') ? identifier : user.phone,
    };
    setUser(updatedUser);
    return { success: true, user: updatedUser };
  };

  // Sign up handler (Triggering the new customer welcome offer)
  const signup = ({ name, mobile, email, password, city, referralCode, influencerCode }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      phone: mobile,
      email,
      city: city || 'Bengaluru',
      isNewUser: true,
      freeDeliveryTokens: 3, // EXACTLY 3 free deliveries (no double 3)
      hasUsedFirstOrderDiscount: false,
      referralCode: `NOVA-${name.toUpperCase().slice(0, 4)}-${Math.floor(100 + Math.random() * 900)}`,
      influencerCode: influencerCode || '',
      referredBy: referralCode || '',
      walletBalance: 50, // Welcome ₹50 bonus points
      loyaltyTier: 'Nova Member',
      loyaltyPoints: 150,
      deliveredOrdersCount: 0,
      lastOrderDate: null,
    };

    setUser(newUser);
    setShowWelcomeModal(true); // Trigger welcome popup
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(DEFAULT_USER);
  };

  // Use a free delivery token (only when delivered)
  const decrementFreeDeliveryToken = () => {
    setUser(prev => ({
      ...prev,
      freeDeliveryTokens: Math.max(0, prev.freeDeliveryTokens - 1)
    }));
  };

  // Add free delivery token (e.g. from scratch card reward)
  const addFreeDeliveryToken = (count = 1) => {
    setUser(prev => ({
      ...prev,
      freeDeliveryTokens: prev.freeDeliveryTokens + count
    }));
  };

  // Wallet credit (for proactive delay compensation or refunds)
  const addWalletCredit = (amount, reason = 'Order Delay Compensation') => {
    setUser(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount,
      walletHistory: [
        ...(prev.walletHistory || []),
        { id: `txn-${Date.now()}`, amount, reason, date: new Date().toISOString() }
      ]
    }));
  };

  // Mark first order discount used
  const markFirstOrderDiscountUsed = () => {
    setUser(prev => ({
      ...prev,
      hasUsedFirstOrderDiscount: true,
      isNewUser: false
    }));
  };

  // Record an order delivered (increments delivered count & updates tier)
  const recordOrderDelivered = () => {
    setUser(prev => {
      const newDeliveredCount = prev.deliveredOrdersCount + 1;
      let newTier = prev.loyaltyTier;
      let bonusPoints = 50;
      if (newDeliveredCount >= 10) newTier = 'Gold Member';
      else if (newDeliveredCount >= 4) newTier = 'Silver Member';

      // After 3rd order, special Nova Member bonus
      const isThirdOrderBonus = newDeliveredCount === 3;
      if (isThirdOrderBonus) bonusPoints += 200;

      return {
        ...prev,
        deliveredOrdersCount: newDeliveredCount,
        loyaltyTier: newTier,
        loyaltyPoints: prev.loyaltyPoints + bonusPoints,
        lastOrderDate: new Date().toISOString(),
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        showWelcomeModal,
        setShowWelcomeModal,
        welcomeBannerDismissed,
        setWelcomeBannerDismissed,
        decrementFreeDeliveryToken,
        addFreeDeliveryToken,
        addWalletCredit,
        markFirstOrderDiscountUsed,
        recordOrderDelivered,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

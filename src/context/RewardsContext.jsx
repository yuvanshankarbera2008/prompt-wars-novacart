import React, { createContext, useContext, useState, useEffect } from 'react';

const RewardsContext = createContext();

const INITIAL_COUPONS = [
  {
    id: 'c-festive-50',
    code: 'FESTIVE50',
    title: '₹50 Flat Off on Groceries',
    description: 'Valid on orders above ₹499 across all neighbourhood stores.',
    discountAmount: 50,
    minOrder: 499,
    discountType: 'flat',
    expiresInDays: 14,
    validCategory: 'All',
  },
  {
    id: 'c-bakery-15',
    code: 'BAKERY15',
    title: '15% Off Oven-Fresh Bakery',
    description: 'Melt-in-mouth treats from local bakeries. Max discount ₹100.',
    discountPercent: 15,
    maxDiscount: 100,
    minOrder: 250,
    discountType: 'percent',
    expiresInDays: 7,
    validCategory: 'Bakery & Cakes',
  }
];

export function RewardsProvider({ children }) {
  const [scratchCards, setScratchCards] = useState(() => {
    const saved = localStorage.getItem('nova_scratch_cards');
    return saved ? JSON.parse(saved) : [
      {
        id: 'sc-welcome-01',
        title: 'Nova Star Welcome Scratch Card',
        orderId: 'ORD-WELCOME',
        orderAmount: 550,
        isScratched: false,
        reward: {
          type: 'coupon',
          code: 'STAR75',
          title: '₹75 Flat Off',
          description: 'Applicable on your next order above ₹399',
          discountAmount: 75,
          minOrder: 399
        }
      }
    ];
  });

  const [claimedCoupons, setClaimedCoupons] = useState(() => {
    const saved = localStorage.getItem('nova_claimed_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [storeStamps, setStoreStamps] = useState(() => {
    const saved = localStorage.getItem('nova_store_stamps');
    return saved ? JSON.parse(saved) : {
      'store-blr-01': 3, // Sri Sai Supermarket
      'store-blr-02': 4, // Royal Bakery
      'store-blr-03': 1,
    };
  });

  const [activeScratchModalCard, setActiveScratchModalCard] = useState(null);

  useEffect(() => {
    localStorage.setItem('nova_scratch_cards', JSON.stringify(scratchCards));
  }, [scratchCards]);

  useEffect(() => {
    localStorage.setItem('nova_claimed_coupons', JSON.stringify(claimedCoupons));
  }, [claimedCoupons]);

  useEffect(() => {
    localStorage.setItem('nova_store_stamps', JSON.stringify(storeStamps));
  }, [storeStamps]);

  // Create scratch card upon qualifying order (>= ₹500)
  const awardScratchCard = (orderId, orderAmount) => {
    const rewardOptions = [
      { type: 'coupon', code: 'LUCKY50', title: '₹50 Off Your Next Order', discountAmount: 50, minOrder: 299 },
      { type: 'coupon', code: 'SAVE100', title: '₹100 Mega Saver Voucher', discountAmount: 100, minOrder: 599 },
      { type: 'token', title: '+1 Free Delivery Token 🚚', description: 'Added directly to your free delivery wallet' },
      { type: 'points', title: '150 Bonus Nova Points 🪙', points: 150 },
      { type: 'percent', code: 'BONUS15', title: '15% Off Local Stores', discountPercent: 15, maxDiscount: 120, minOrder: 350 },
      { type: 'consolation', title: '10 Nova Points + Sweet Smile 😊', points: 10, description: 'Better luck next time!' }
    ];

    const chosen = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
    const newCard = {
      id: `sc-${Date.now()}`,
      title: 'Order Bonus Scratch Card',
      orderId,
      orderAmount,
      isScratched: false,
      reward: chosen
    };

    setScratchCards(prev => [newCard, ...prev]);
    setActiveScratchModalCard(newCard);
    return newCard;
  };

  const markCardAsScratched = (cardId, reward) => {
    setScratchCards(prev => prev.map(c => c.id === cardId ? { ...c, isScratched: true } : c));
    if (reward.code) {
      setClaimedCoupons(prev => [
        {
          id: `coupon-${Date.now()}`,
          code: reward.code,
          title: reward.title,
          description: reward.description || `Unlocked via Scratch Card for order #${cardId}`,
          discountAmount: reward.discountAmount || 0,
          discountPercent: reward.discountPercent || 0,
          maxDiscount: reward.maxDiscount || 0,
          minOrder: reward.minOrder || 199,
          expiresInDays: 14,
          discountType: reward.discountPercent ? 'percent' : 'flat'
        },
        ...prev
      ]);
    }
  };

  const addStoreStamp = (storeId) => {
    setStoreStamps(prev => ({
      ...prev,
      [storeId]: (prev[storeId] || 0) + 1
    }));
  };

  return (
    <RewardsContext.Provider
      value={{
        scratchCards,
        claimedCoupons,
        storeStamps,
        awardScratchCard,
        markCardAsScratched,
        addStoreStamp,
        activeScratchModalCard,
        setActiveScratchModalCard
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) throw new Error('useRewards must be used within RewardsProvider');
  return context;
}

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminContext = createContext();

const INITIAL_SUPPORT_TICKETS = [
  {
    id: 'TCK-8801',
    customerName: 'Priya Nambiar',
    customerPhone: '+91 98451 11223',
    orderId: 'ORD-772910',
    issueType: 'Late Delivery',
    tag: 'Urgent',
    description: 'Order was delayed by 18 minutes due to sudden rain in Indiranagar.',
    status: 'Resolved',
    refundAmount: 30,
    refundStatus: 'Processed to Wallet',
    createdAt: '10 mins ago'
  },
  {
    id: 'TCK-8802',
    customerName: 'Amit Saxena',
    customerPhone: '+91 98200 44556',
    orderId: 'ORD-772895',
    issueType: 'Missing Item',
    tag: 'Refund Requested',
    description: '1 packet Amul Taaza Milk was missing from grocery bundle.',
    status: 'Pending',
    refundAmount: 28,
    refundStatus: 'Pending Approval',
    createdAt: '25 mins ago'
  },
  {
    id: 'TCK-8803',
    customerName: 'Kavita Das',
    customerPhone: '+91 99102 77889',
    orderId: 'ORD-772840',
    issueType: 'Damaged Item',
    tag: 'Quality Check',
    description: 'Bread packet seal was torn during transit.',
    status: 'In Progress',
    refundAmount: 42,
    refundStatus: 'Processing',
    createdAt: '1 hour ago'
  }
];

export function AdminProvider({ children }) {
  // Stock overrides: productId -> { status: 'in_stock' | 'low_stock' | 'out_of_stock', count: number }
  const [stockOverrides, setStockOverrides] = useState(() => {
    const saved = localStorage.getItem('nova_stock_overrides');
    return saved ? JSON.parse(saved) : {};
  });

  // Promo Guardrail settings
  const [promoGuardrails, setPromoGuardrails] = useState(() => {
    const saved = localStorage.getItem('nova_promo_guardrails');
    return saved ? JSON.parse(saved) : {
      maxFirstOrderDiscount: 150,
      minOrderValueFirstOrder: 199,
      maxPromoSpendPercent: 35, // Alert triggered if promo spend > 35% of revenue
      currentPromoSpend: 1700000, // ₹17 Lakhs (from problem statement)
      currentRevenue: 2610000,    // ₹26.1 Lakhs
    };
  });

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState(() => {
    const saved = localStorage.getItem('nova_support_tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // Influencer Tracking
  const [influencerStats, setInfluencerStats] = useState(() => {
    return [
      { code: 'NOVA-RIYA', name: 'Riya Sen (Food & Lifestyle)', orders: 342, gmv: 184500, conversionRate: '14.8%', status: 'Active' },
      { code: 'NOVA-BLR-FOOD', name: 'Bangalore Food Guide', orders: 280, gmv: 142000, conversionRate: '12.2%', status: 'Active' },
      { code: 'NOVA-MUMBAI-MOM', name: 'Smart Mumbai Mom', orders: 195, gmv: 98400, conversionRate: '11.5%', status: 'Active' },
      { code: 'NOVA-FITNESS', name: 'Karan Wellness', orders: 88, gmv: 49200, conversionRate: '9.1%', status: 'Paused' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('nova_stock_overrides', JSON.stringify(stockOverrides));
  }, [stockOverrides]);

  useEffect(() => {
    localStorage.setItem('nova_promo_guardrails', JSON.stringify(promoGuardrails));
  }, [promoGuardrails]);

  useEffect(() => {
    localStorage.setItem('nova_support_tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const updateProductStock = (productId, status, count) => {
    setStockOverrides(prev => ({
      ...prev,
      [productId]: { status, count: Number(count) }
    }));
  };

  const resolveTicket = (ticketId, refundGranted = true) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Resolved',
          refundStatus: refundGranted ? 'Instant Refund Credited to NOVA Wallet' : 'Resolved with Explanation'
        };
      }
      return t;
    }));
  };

  const createTicket = (ticketData) => {
    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: 'Just now',
      status: 'Pending',
      refundStatus: ticketData.refundAmount ? 'Pending Instant Refund' : 'Assigned to Agent',
      ...ticketData
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  // Promo guardrail alert trigger
  const promoSpendRatio = (promoGuardrails.currentPromoSpend / promoGuardrails.currentRevenue) * 100;
  const isPromoWarningActive = promoSpendRatio > promoGuardrails.maxPromoSpendPercent;

  return (
    <AdminContext.Provider
      value={{
        stockOverrides,
        updateProductStock,
        promoGuardrails,
        setPromoGuardrails,
        isPromoWarningActive,
        promoSpendRatio,
        supportTickets,
        resolveTicket,
        createTicket,
        influencerStats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
}

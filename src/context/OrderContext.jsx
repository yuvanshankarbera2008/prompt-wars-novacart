import React, { createContext, useContext, useState, useEffect } from 'react';
import partners from '../data/partners.json';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('nova_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeOrderId, setActiveOrderId] = useState(() => {
    return localStorage.getItem('nova_active_order_id') || null;
  });

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('nova_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (activeOrderId) {
      localStorage.setItem('nova_active_order_id', activeOrderId);
    } else {
      localStorage.removeItem('nova_active_order_id');
    }
  }, [activeOrderId]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getActiveOrder = () => {
    return orders.find(o => o.id === activeOrderId) || orders[0] || null;
  };

  // Place a new order
  const createOrder = (orderData) => {
    const partner = partners[Math.floor(Math.random() * partners.length)];
    const newOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      status: 'placed', // 'placed' | 'confirmed' | 'packing' | 'partner_assigned' | 'out_for_delivery' | 'delivered'
      statusStepIndex: 0,
      partner,
      ...orderData,
      isDelayed: false,
      delayMinutes: 0,
      delayCreditGiven: false,
      riderLocation: {
        lat: orderData.store.lat,
        lng: orderData.store.lng,
      },
      currentEtaMinutes: orderData.estimatedMinutesRange ? orderData.estimatedMinutesRange[1] : 20,
      statusHistory: [
        { status: 'placed', title: 'Order Placed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderId(newOrder.id);
    addToast(`Order #${newOrder.id} placed successfully! 🎉`, 'success');
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, newStatus, stepIndex, extra = {}) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        const statusTitles = {
          placed: 'Order Placed',
          confirmed: 'Store Confirmed (Stock Reserved)',
          packing: 'Items Packed & Quality Checked',
          partner_assigned: 'Delivery Partner Assigned',
          out_for_delivery: 'Out for Delivery (Rider on the way)',
          delivered: 'Order Delivered Safely'
        };

        const existingHist = ord.statusHistory || [];
        const updatedHistory = [
          ...existingHist,
          {
            status: newStatus,
            title: statusTitles[newStatus] || newStatus,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            done: true
          }
        ];

        return {
          ...ord,
          status: newStatus,
          statusStepIndex: stepIndex,
          statusHistory: updatedHistory,
          ...extra
        };
      }
      return ord;
    }));
  };

  // Trigger Proactive Delay
  const triggerProactiveDelay = (orderId) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId && !ord.delayCreditGiven) {
        addToast("🙏 Your order is 5 min late. We've credited ₹30 to your NOVA Wallet!", 'warning');
        return {
          ...ord,
          isDelayed: true,
          delayMinutes: 5,
          delayCreditGiven: true,
          currentEtaMinutes: (ord.currentEtaMinutes || 15) + 5
        };
      }
      return ord;
    }));
  };

  // Update rider coordinates
  const updateRiderLocation = (orderId, lat, lng, remainingEta) => {
    setOrders(prev => prev.map(ord => {
      if (ord.id === orderId) {
        return {
          ...ord,
          riderLocation: { lat, lng },
          currentEtaMinutes: remainingEta !== undefined ? remainingEta : ord.currentEtaMinutes
        };
      }
      return ord;
    }));
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        activeOrderId,
        setActiveOrderId,
        getActiveOrder,
        createOrder,
        updateOrderStatus,
        triggerProactiveDelay,
        updateRiderLocation,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}

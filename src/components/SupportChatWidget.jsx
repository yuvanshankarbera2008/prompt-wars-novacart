import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, ShieldCheck, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

export function SupportChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! 🙏 I am NOVA Assistant. Need help with late delivery, refund, or a missing item?',
      time: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const { createTicket } = useAdmin();
  const { user, addWalletCredit } = useAuth();

  const handleSend = (userQuery) => {
    const q = userQuery || inputText;
    if (!q.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Automated smart assistant resolution
    setTimeout(() => {
      let reply = "Thank you for reaching out! A neighbourhood store representative has been notified.";
      
      const lower = q.toLowerCase();
      if (lower.includes('late') || lower.includes('delay')) {
        reply = "🙏 If your order is more than 5 minutes past the estimated window, NOVA automatically credits ₹30 to your wallet. We believe in transparent reliability!";
        addWalletCredit(30, 'Chat Resolution - Order Delay');
      } else if (lower.includes('refund') || lower.includes('missing') || lower.includes('damage')) {
        const ticket = createTicket({
          customerName: user?.name || 'Customer',
          customerPhone: user?.phone || '+91 98450 12345',
          orderId: 'ORD-CURRENT',
          issueType: 'Item Issue / Refund',
          tag: 'Auto-Bot Resolved',
          description: q,
          refundAmount: 45
        });
        reply = `Ticket #${ticket.id} generated! Your ₹45 refund has been queued and credited to your NOVA Wallet under our 100% Reliability Guarantee.`;
        addWalletCredit(45, `Automated Refund - #${ticket.id}`);
      } else if (lower.includes('free delivery') || lower.includes('token')) {
        reply = `You currently have ${user?.freeDeliveryTokens ?? 3} free delivery tokens. Also remember: any cart of ₹2,000+ unlocks FREE delivery without using a token!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 700);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          id="floating-support-btn"
          className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 bg-gradient-to-tr from-brand-800 to-indigo-600 hover:from-brand-900 hover:to-indigo-700 text-white p-3.5 sm:px-4 sm:py-3 rounded-2xl shadow-xl shadow-brand-700/30 flex items-center gap-2 group transition-all hover:scale-105 active:scale-95"
          title="Instant Help & Resolution"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span className="hidden sm:inline font-bold text-xs">Help & Instant Refund</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[460px] animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-950 via-brand-900 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-xs font-black">NOVA Support Assistant</h4>
                <p className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Instant Automated Resolver
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Issue Chips */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {['Late order compensation', 'Missing milk packet', 'Free delivery rules'].map(chip => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                className="text-[10px] font-bold bg-white text-brand-700 px-2.5 py-1 rounded-xl border border-slate-200 hover:bg-brand-50 whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-slate-50/50">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex flex-col max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-bl-xs'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask for refund, report delay..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

import React, { useState } from 'react';
import { HelpCircle, MessageSquare, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';

export function SupportPage() {
  const { createTicket } = useAdmin();
  const { user } = useAuth();
  const [selectedIssue, setSelectedIssue] = useState('Late Delivery');
  const [description, setDescription] = useState('');
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const t = createTicket({
      customerName: user?.name || 'Customer',
      customerPhone: user?.phone || '+91 98450 12345',
      orderId: 'ORD-LATEST',
      issueType: selectedIssue,
      tag: selectedIssue === 'Late Delivery' ? 'Late Transit' : 'Item Check',
      description: description || `Issue reported for ${selectedIssue}`,
      refundAmount: selectedIssue === 'Late Delivery' ? 30 : 50
    });
    setSubmittedTicket(t);
  };

  return (
    <div className="space-y-6 pb-20 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Help & Support Hub</h1>
        <p className="text-xs text-slate-500">1-tap order issue resolution and transparent refund tracking</p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        {submittedTicket ? (
          <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-extrabold text-emerald-950 text-base">Ticket #{submittedTicket.id} Created!</h3>
            <p className="text-xs text-emerald-800">
              Our automated reliability system is processing your request. Any eligible refund will be credited instantly to your NOVA Wallet.
            </p>
            <button
              onClick={() => { setSubmittedTicket(null); setDescription(''); }}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
            >
              Report Another Issue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Select Issue Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Late Delivery', 'Missing Item', 'Damaged Item', 'Refund Query'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setSelectedIssue(type)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      selectedIssue === type
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description / Notes</label>
              <textarea
                rows={3}
                placeholder="Please describe what went wrong..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
            >
              Submit Ticket for Instant Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

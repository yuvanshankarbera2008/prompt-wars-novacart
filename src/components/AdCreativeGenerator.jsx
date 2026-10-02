import React, { useState } from 'react';
import { Share2, Sparkles, Copy, Check, Download, ExternalLink } from 'lucide-react';

export function AdCreativeGenerator() {
  const [platform, setPlatform] = useState('instagram'); // instagram | whatsapp | youtube | facebook
  const [campaignName, setCampaignName] = useState('neighbourhood_retention');
  const [discountHeadline, setDiscountHeadline] = useState('50% OFF First Order + 3 Free Deliveries');
  const [copiedLink, setCopiedLink] = useState(false);

  const utmUrl = `https://novacart.local/?utm_source=${platform}&utm_medium=social_ad&utm_campaign=${campaignName}&utm_content=retention_v1`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(utmUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
            Growth & Marketing Toolkit
          </span>
        </div>
        <h3 className="text-lg font-black text-slate-900 mt-1">Social Media Ad Creative & UTM Generator</h3>
        <p className="text-xs text-slate-500">
          Create trackable acquisition and retention campaign links for social channels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Social Platform</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'instagram', label: 'Instagram' },
                { id: 'whatsapp', label: 'WhatsApp' },
                { id: 'youtube', label: 'YouTube' },
                { id: 'facebook', label: 'Facebook' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-extrabold border transition-all ${
                    platform === p.id
                      ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Tag</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Ad Headline Copy</label>
            <input
              type="text"
              value={discountHeadline}
              onChange={(e) => setDiscountHeadline(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Generated Link */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Tracked UTM URL</span>
            <p className="text-xs font-mono text-slate-700 break-all bg-white p-2 rounded-lg border border-slate-100">
              {utmUrl}
            </p>
            <button
              onClick={handleCopyLink}
              className="w-full py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied Tracked Link!' : 'Copy UTM Link'}</span>
            </button>
          </div>
        </div>

        {/* Live Ad Creative Card Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Ad Preview ({platform.toUpperCase()} Story / Post)
          </span>

          <div className="bg-gradient-to-br from-brand-950 via-indigo-900 to-purple-950 text-white rounded-3xl p-6 aspect-[4/5] flex flex-col justify-between shadow-2xl border border-brand-800/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">⚡</span>
                <span className="font-extrabold tracking-tight text-sm">NOVA CART</span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
                Sponsored • {platform}
              </span>
            </div>

            <div className="space-y-2 my-auto">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full inline-block border border-amber-400/30">
                Neighbourhood Special
              </span>
              <h4 className="text-2xl font-black leading-tight text-white">
                {discountHeadline}
              </h4>
              <p className="text-xs text-slate-200">
                Support 620+ local grocery stores and bakeries across Bengaluru, Mumbai & Delhi. Receive your order within 10–30 min!
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/15">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>🚚 3 Free Deliveries</span>
                <span>⭐ 4.8★ Local Stores</span>
              </div>
              <div className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-black rounded-xl text-xs text-center shadow-lg">
                Shop Local Neighbourhood
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

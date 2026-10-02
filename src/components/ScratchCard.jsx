import React, { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Gift, CheckCircle2, Copy } from 'lucide-react';
import { useRewards } from '../context/RewardsContext';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/formatters';

export function ScratchCard({ card, onComplete }) {
  const canvasRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(card?.isScratched || false);
  const [scratchedPercent, setScratchedPercent] = useState(card?.isScratched ? 100 : 0);
  const isDrawingRef = useRef(false);

  const { markCardAsScratched } = useRewards();
  const { addFreeDeliveryToken, addWalletCredit } = useAuth();

  useEffect(() => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Setup canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Draw metallic silver/bronze surface
    const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    gradient.addColorStop(0, '#94a3b8');
    gradient.addColorStop(0.3, '#cbd5e1');
    gradient.addColorStop(0.5, '#e2e8f0');
    gradient.addColorStop(0.7, '#cbd5e1');
    gradient.addColorStop(1, '#64748b');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add metallic sheen lines & text
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 15px Plus Jakarta Sans, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH HERE ✨', rect.width / 2, rect.height / 2 - 10);

    ctx.font = '11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Move mouse or touch to reveal', rect.width / 2, rect.height / 2 + 15);
  }, [isRevealed]);

  const scratch = (clientX, clientY) => {
    if (isRevealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Sample pixels to measure scratched percentage
    checkScratchPercentage(canvas, ctx, rect);
  };

  const checkScratchPercentage = (canvas, ctx, rect) => {
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let transparentPixels = 0;
      const totalPixels = data.length / 4;

      // Sample every 16th pixel for speed
      for (let i = 3; i < data.length; i += 16 * 4) {
        if (data[i] === 0) {
          transparentPixels++;
        }
      }

      const percent = Math.round((transparentPixels / (totalPixels / 16)) * 100);
      setScratchedPercent(percent);

      if (percent > 40 && !isRevealed) {
        setIsRevealed(true);
        markCardAsScratched(card.id, card.reward);

        // Apply bonus perk if token or wallet
        if (card.reward.type === 'token') {
          addFreeDeliveryToken(1);
        } else if (card.reward.type === 'points') {
          addWalletCredit(50, 'Nova Points Scratch Card');
        }

        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}

        if (onComplete) onComplete(card.reward);
      }
    } catch (e) {}
  };

  const handleMouseDown = (e) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[16/10] rounded-3xl overflow-hidden shadow-xl border-2 border-amber-300/60 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 select-none">
      {/* Hidden Card Content Revealed Beneath */}
      <div className="absolute inset-0 p-5 flex flex-col items-center justify-center text-center text-white space-y-2 z-0">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
          🎁
        </div>
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full border border-white/20">
            Nova Star Scratch Reward
          </span>
          <h3 className="text-xl font-black mt-1">{card.reward?.title}</h3>
          <p className="text-xs text-amber-100 max-w-xs mx-auto mt-0.5">
            {card.reward?.description || "Usable on your 2nd order onward from saved shops!"}
          </p>
        </div>

        {card.reward?.code && (
          <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 mt-1">
            <span className="font-mono font-black text-sm text-amber-300">{card.reward.code}</span>
            <button
              onClick={() => alert(`Copied code ${card.reward.code}!`)}
              className="text-[10px] font-bold text-white/80 hover:text-white"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Canvas Scratch Foil Overlay */}
      {!isRevealed && (
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUp}
          className="absolute inset-0 w-full h-full cursor-pointer z-10 touch-none"
        />
      )}
    </div>
  );
}

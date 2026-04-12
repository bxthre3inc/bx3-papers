import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface SlotReelProps {
  symbols: string[];
  spinning: boolean;
  result: number;
  delay: number;
}

const SlotReel: React.FC<SlotReelProps> = ({ symbols, spinning, result, delay }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!spinning) {
      const timeout = setTimeout(() => setCurrentIndex(result), delay);
      return () => clearTimeout(timeout);
    }
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % symbols.length);
    }, 80);
    return () => clearInterval(interval);
  }, [spinning, result, delay, symbols.length]);

  return (
    <div className="relative w-16 h-24 overflow-hidden bg-gradient-to-b from-amber-900 to-amber-950 rounded-lg border-2 border-amber-600 shadow-inner">
      <div
        className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500"
        style={{ transform: `translateY(${currentIndex * -48}px)` }}
      >
        {symbols.map((sym, i) => (
          <div key={i} className="w-16 h-24 flex items-center justify-center text-3xl font-black text-yellow-300">
            {sym}
          </div>
        ))}
      </div>
    </div>
  );
};

interface SlotMachineProps {
  gameId: string;
  category?: string;
  betAmount?: number;
  onWin?: (amount: number) => void;
  onSpinStart?: () => void;
  themeId?: string;
  manifest?: any;
}

const THEMES: Record<string, { symbols: string[]; bg: string }> = {
  classic: { symbols: ['🍒', '🍋', '🔔', '⭐', '💎', '7️⃣'], bg: 'from-yellow-900 to-amber-950' },
  western: { symbols: ['🤠', '🌵', '🌙', '⭐', '🦅', '💰'], bg: 'from-amber-900 to-orange-950' },
  ocean: { symbols: ['🐟', '🦀', '🐙', '⭐', '💎', '🐠'], bg: 'from-blue-900 to-cyan-950' },
  cyberpunk: { symbols: ['🤖', '⚡', '🔮', '⭐', '💜', '🏁'], bg: 'from-purple-950 to-violet-950' },
};

const UniversalSlotMachine: React.FC<SlotMachineProps> = ({
  gameId,
  category,
  betAmount = 10,
  onWin,
  onSpinStart,
  themeId = 'classic',
  manifest,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [results, setResults] = useState([0, 0, 0]);
  const [balance, setBalance] = useState(1000);
  const [lastWin, setLastWin] = useState(0);

  const resolvedTheme = themeId && THEMES[themeId] ? themeId : 'classic';
  const theme = THEMES[resolvedTheme] || THEMES.classic;

  const handleSpin = useCallback(() => {
    if (spinning || balance < betAmount) return;
    setBalance(b => b - betAmount);
    setLastWin(0);
    onSpinStart?.();
    setSpinning(true);

    const newResults = [
      Math.floor(Math.random() * theme.symbols.length),
      Math.floor(Math.random() * theme.symbols.length),
      Math.floor(Math.random() * theme.symbols.length),
    ];
    setResults(newResults);

    setTimeout(() => {
      setSpinning(false);
      const allSame = newResults[0] === newResults[1] && newResults[1] === newResults[2];
      const winAmount = allSame ? betAmount * 10 : newResults[0] === newResults[1] || newResults[1] === newResults[2] ? betAmount * 2 : 0;
      if (winAmount > 0) {
        setBalance(b => b + winAmount);
        setLastWin(winAmount);
        onWin?.(winAmount);
      }
    }, 2500);
  }, [spinning, balance, betAmount, theme.symbols.length, onSpinStart, onWin]);

  return (
    <div className={`flex flex-col items-center gap-4 p-6 bg-gradient-to-b ${theme.bg} rounded-2xl`}>
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <SlotReel key={i} symbols={theme.symbols} spinning={spinning} result={results[i]} delay={i * 300} />
          ))}
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-black text-yellow-300">{balance.toLocaleString()} GC</div>
        {lastWin > 0 && <div className="text-green-400 font-bold text-lg animate-pulse">WIN +{lastWin}!</div>}
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning || balance < betAmount}
        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 disabled:from-gray-600 disabled:to-gray-700 text-black font-black py-4 px-12 rounded-xl text-xl shadow-lg shadow-amber-900/50 disabled:opacity-50"
      >
        {spinning ? 'SPINNING...' : `SPIN ${betAmount} GC`}
      </button>
    </div>
  );
};

export default UniversalSlotMachine;

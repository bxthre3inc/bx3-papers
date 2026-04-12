import React from 'react';

interface Tier {
  name: string;
  threshold: number;
  multiplier: number;
  perks: string[];
}

interface LoyaltyCardProps {
  points: number;
  tier: string;
  lifetimePoints: number;
  tiers: Tier[];
  nextTierPoints?: number;
}

export function LoyaltyCard({ points, tier, lifetimePoints, tiers, nextTierPoints }: LoyaltyCardProps) {
  const progress = nextTierPoints ? (points / nextTierPoints) * 100 : 100;
  const currentTier = tiers.find(t => t.name === tier) || tiers[0];
  
  return (
    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-amber-100 text-sm font-medium">{tier}</p>
          <h3 className="text-3xl font-bold">{points.toLocaleString()}</h3>
          <p className="text-amber-100 text-xs">Points Available</p>
        </div>
        <div className="bg-white/20 rounded-lg px-3 py-1">
          <span className="text-xs font-medium">{currentTier.multiplier}x Multiplier</span>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Progress to next tier</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-white/30 rounded-full">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-1">
        {currentTier.perks.slice(0, 3).map((perk, i) => (
          <p key={i} className="text-xs text-amber-50 flex items-center gap-1">
            <span>✓</span> {perk}
          </p>
        ))}
      </div>
    </div>
  );
}

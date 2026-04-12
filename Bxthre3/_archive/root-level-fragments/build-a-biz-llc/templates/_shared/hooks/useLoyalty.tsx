import { useState, useCallback } from 'react';

interface Tier {
  name: string;
  threshold: number;
  multiplier: number;
  perks: string[];
}

interface LoyaltyState {
  points: number;
  lifetimePoints: number;
  tier: string;
  tiers: Tier[];
  earnRate: number;
}

export function useLoyalty(config: { tiers?: Tier[]; earnRate?: number }) {
  const defaultTiers = [
    { name: 'Member', threshold: 0, multiplier: 1, perks: [] },
    { name: 'Silver', threshold: 500, multiplier: 1.25, perks: ['Free birthday item'] },
    { name: 'Gold', threshold: 1500, multiplier: 1.5, perks: ['Free birthday item', 'Early access to new items'] },
  ];

  const tiers = config.tiers || defaultTiers;
  const earnRate = config.earnRate || 1;

  const [state, setState] = useState<LoyaltyState>({
    points: 0,
    lifetimePoints: 0,
    tier: tiers[0].name,
    tiers,
    earnRate,
  });

  const earnPoints = useCallback((dollarAmount: number) => {
    const currentTier = tiers.find(t => t.name === state.tier) || tiers[0];
    const points = Math.floor(dollarAmount * earnRate * currentTier.multiplier);
    
    setState(prev => {
      const newLifetime = prev.lifetimePoints + points;
      const newTier = [...tiers].reverse().find(t => newLifetime >= t.threshold) || tiers[0];
      
      return {
        ...prev,
        points: prev.points + points,
        lifetimePoints: newLifetime,
        tier: newTier.name,
      };
    });
  }, [state.tier, earnRate, tiers]);

  const redeemPoints = useCallback((points: number) => {
    if (state.points >= points) {
      setState(prev => ({ ...prev, points: prev.points - points }));
      return true;
    }
    return false;
  }, [state.points]);

  const nextTierPoints = useCallback(() => {
    const currentIdx = tiers.findIndex(t => t.name === state.tier);
    const nextTier = tiers[currentIdx + 1];
    return nextTier ? nextTier.threshold : null;
  }, [state.tier, tiers]);

  return {
    ...state,
    earnPoints,
    redeemPoints,
    nextTierPoints: nextTierPoints(),
    progress: nextTierPoints() ? (state.lifetimePoints / nextTierPoints()!) * 100 : 100,
  };
}

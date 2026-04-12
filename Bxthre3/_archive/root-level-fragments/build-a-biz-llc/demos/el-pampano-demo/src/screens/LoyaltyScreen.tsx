import React from 'react';
import config from '../config.json';
import { LoyaltyCard } from '../../../_shared/components/LoyaltyCard';

export function LoyaltyScreen() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-serif font-semibold mb-6">Rewards</h1>
        
        {config.loyalty?.enabled && (
          <LoyaltyCard
            points={750}
            tier="Silver"
            lifetimePoints={1250}
            tiers={config.loyalty.tiers || []}
            nextTierPoints={1500}
          />
        )}
        
        <div className="mt-6 bg-white rounded-2xl p-4 border border-gray-200">
          <h3 className="font-semibold mb-3">Available Rewards</h3>
          <div className="space-y-2">
            {config.loyalty?.tiers?.map(tier => (
              <div key={tier.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium">{tier.name}</span>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{tier.threshold}+ points</p>
                  {tier.multiplier > 1 && (
                    <span className="text-xs text-amber-600">{tier.multiplier}x points</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

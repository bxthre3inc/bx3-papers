import React from 'react';
import config from '../config.json';
import { GiftCardPurchase } from '../../../_shared/components/GiftCard';

export function GiftCardsScreen() {
  const handlePurchase = (amount: number, email: string) => {
    console.log(`Purchase ${amount} gift card for ${email}`);
    // Integrate with Stripe
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-serif font-semibold mb-6">Gift Cards</h1>
        
        {config.giftCards?.enabled && (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white mb-6">
              <h3 className="text-lg font-semibold mb-2">Give the Gift of {config.meta.businessName}</h3>
              <p className="text-white/80 text-sm">Perfect for birthdays, holidays, or just because.</p>
            </div>
            
            <GiftCardPurchase
              denominations={config.giftCards.denominations || [10, 25, 50, 100]}
              onPurchase={handlePurchase}
            />
            
            <div className="mt-6 bg-white rounded-2xl p-4 border border-gray-200">
              <h4 className="font-medium mb-2">Your Gift Cards</h4>
              <p className="text-gray-500 text-sm">Sign in to view your gift card balance</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

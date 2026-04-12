import React, { useState } from 'react';

interface GiftCardProps {
  denominations: number[];
  currency?: string;
  onPurchase: (amount: number, email: string) => void;
}

export function GiftCardPurchase({ denominations, currency = '$', onPurchase }: GiftCardProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');

  const handlePurchase = () => {
    const amount = selectedAmount || parseFloat(customAmount);
    if (amount && recipientEmail) {
      onPurchase(amount, recipientEmail);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold mb-4">Send a Gift Card</h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {denominations.map(amount => (
          <button
            key={amount}
            onClick={() => setSelectedAmount(amount)}
            className={`py-3 rounded-xl font-semibold transition-colors ${
              selectedAmount === amount 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {currency}{amount}
          </button>
        ))}
      </div>
      
      <input
        type="number"
        placeholder="Custom amount"
        value={customAmount}
        onChange={(e) => {
          setCustomAmount(e.target.value);
          setSelectedAmount(null);
        }}
        className="w-full p-3 border rounded-xl mb-3 text-sm"
      />
      
      <input
        type="email"
        placeholder="Recipient email"
        value={recipientEmail}
        onChange={(e) => setRecipientEmail(e.target.value)}
        className="w-full p-3 border rounded-xl mb-3 text-sm"
      />
      
      <textarea
        placeholder="Add a personal message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full p-3 border rounded-xl mb-4 text-sm resize-none h-20"
      />
      
      <button
        onClick={handlePurchase}
        disabled={!selectedAmount && !customAmount}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50"
      >
        Purchase Gift Card
      </button>
    </div>
  );
}

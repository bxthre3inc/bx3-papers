import React from 'react';

export function CheckoutScreen() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-serif font-semibold mb-6">Checkout</h1>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
          <h3 className="font-medium mb-3">Pickup or Delivery?</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-3 bg-gray-900 text-white rounded-xl font-medium">
              Pickup
            </button>
            <button className="py-3 bg-gray-100 text-gray-600 rounded-xl font-medium">
              Delivery
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-4 border border-gray-200 mb-4">
          <h3 className="font-medium mb-3">Payment Method</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border rounded-xl bg-blue-50 border-blue-200">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">CC</div>
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-xl">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 text-xs font-bold">CR</div>
              <span>CRED Wallet</span>
            </div>
          </div>
        </div>
        
        <button className="w-full btn-primary">
          Place Order
        </button>
      </div>
    </div>
  );
}

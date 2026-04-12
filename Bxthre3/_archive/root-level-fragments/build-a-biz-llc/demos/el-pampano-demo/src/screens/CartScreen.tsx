import React from 'react';
import config from '../config.json';

export function CartScreen() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6">
      <div className="max-w-lg mx-auto px-4">
        <h1 className="text-2xl font-serif font-semibold mb-6">Your Order</h1>
        
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
          <p className="text-gray-400">Cart is empty</p>
          <p className="text-sm text-gray-500 mt-2">Add some delicious items from the menu</p>
        </div>
        
        <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Subtotal</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Tax</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>$0.00</span>
          </div>
        </div>
        
        <button className="w-full btn-primary mt-4">
          Checkout
        </button>
      </div>
    </div>
  );
}

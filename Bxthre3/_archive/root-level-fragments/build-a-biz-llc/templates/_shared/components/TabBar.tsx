import React from 'react';
import { ShoppingBag, Gift, User, Utensils } from 'lucide-react';

interface TabBarProps {
  active: string;
  onChange: (tab: 'menu' | 'cart' | 'loyalty' | 'gifts') => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  const tabs = [
    { id: 'menu', icon: Utensils, label: 'Menu' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart' },
    { id: 'loyalty', icon: User, label: 'Rewards' },
    { id: 'gifts', icon: Gift, label: 'Gift Cards' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 pb-safe">
      <div className="flex justify-around items-center h-16">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as 'menu' | 'cart' | 'loyalty' | 'gifts')}
            className={`flex flex-col items-center justify-center min-w-[64px] h-full ${
              active === tab.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            <tab.icon size={24} strokeWidth={active === tab.id ? 2.5 : 2} />
            <span className="text-xs mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

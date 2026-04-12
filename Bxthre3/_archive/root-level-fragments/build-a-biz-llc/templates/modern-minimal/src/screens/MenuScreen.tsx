import React from 'react';
import { useState } from 'react';
import config from '../config.json';

interface MenuCategory {
  id: string;
  name: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    description?: string;
  }>;
}

export function MenuScreen() {
  const [activeCat, setActiveCat] = useState(config.menu.categories[0].id);
  const [cart, setCart] = useState<Record<string, number>>({});

  const categories = config.menu.categories as MenuCategory[];
  const currentCategory = categories.find(c => c.id === activeCat) || categories[0];

  const addToCart = (itemId: string) => {
    setCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-[#E63946] text-white px-6 pt-12 pb-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-3xl font-serif font-semibold">{config.meta.businessName}</h1>
          <p className="text-white/80 text-sm mt-1">{config.meta.tagline}</p>
        </div>
      </header>

      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 overflow-x-auto">
        <div className="flex gap-2 max-w-lg mx-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`category-pill whitespace-nowrap ${
                activeCat === cat.id ? 'active' : 'inactive'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 py-4">
        <h2 className="font-serif text-xl mb-4 text-gray-900">{currentCategory.name}</h2>
        
        <div className="space-y-0">
          {currentCategory.items.map(item => (
            <div key={item.id} className="menu-item">
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                {item.description && (
                  <p className="text-gray-500 text-sm mt-0.5">{item.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">${item.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center"
                >
                  {cart[item.id] || '+'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

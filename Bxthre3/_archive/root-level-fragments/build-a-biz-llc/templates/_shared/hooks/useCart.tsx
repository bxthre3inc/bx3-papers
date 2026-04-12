import { useState, useCallback } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: Array<{ name: string; price: number }>;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const TAX_RATE = 0.0875; // Configurable

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity } : i));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = items.reduce((sum, item) => {
    const modifiersTotal = item.modifiers?.reduce((m, mod) => m + mod.price, 0) || 0;
    return sum + (item.price + modifiersTotal) * item.quantity;
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return {
    items,
    subtotal,
    tax,
    total,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}

import { createContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/api';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data } = await cartService.get();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      loadCart();
    }
  }, []);

  const addItem = async (productId, quantity = 1) => {
    const { data } = await cartService.add({ productId, quantity });
    setItems(data.items || []);
  };

  const updateQuantity = async (productId, quantity) => {
    const { data } = await cartService.add({ productId, quantity, replace: true });
    setItems(data.items || []);
  };

  const removeItem = async (productId) => {
    const { data } = await cartService.remove(productId);
    setItems(data.items || []);
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + item.quantity * (item.productId?.price || 0), 0);

  const value = useMemo(
    () => ({ items, total, loading, addItem, updateQuantity, removeItem, loadCart, clearCart }),
    [items, total, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

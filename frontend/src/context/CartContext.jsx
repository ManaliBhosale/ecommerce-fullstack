import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data.cart || { items: [] });
    } catch {
      setCart({ items: [] });
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart({ items: [] });
    }
  }, [user, fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await API.post('/cart', { productId, quantity });
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    setLoading(true);
    try {
      const { data } = await API.put(`/cart/${productId}`, { quantity });
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    setLoading(true);
    try {
      const { data } = await API.delete(`/cart/${productId}`);
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await API.delete('/cart');
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartTotal =
    cart.items?.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0) || 0;

  return (
    <CartContext.Provider
      value={{ cart, loading, cartCount, cartTotal, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export default CartContext;

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  color?: string;
  quantity?: number;
};

type CartItem = Product & { quantity: number };

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

type StoreContextType = {
  cart: CartItem[];
  wishlist: Product[];
  user: User;
  isAuthLoading: boolean;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  clearCart: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  cartTotal: number;
  cartCount: number;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Check auth on mount
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('zerano_cart_next');
    const savedWishlist = localStorage.getItem('zerano_wishlist_next');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

    // Check if user is logged in
    refreshUser();
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('zerano_cart_next', JSON.stringify(cart));
      localStorage.setItem('zerano_wishlist_next', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isMounted]);

  const refreshUser = async () => {
    setIsAuthLoading(true);
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setUser(null);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id && item.color === product.color);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCart((prev) => prev.filter((item, i) => i.toString() !== cartId && `${item.id}-${item.color}` !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item, i) => i.toString() === cartId || `${item.id}-${item.color}` === cartId);
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += quantity;
        if (newCart[existingIndex].quantity <= 0) {
          newCart.splice(existingIndex, 1);
        }
        return newCart;
      }
      return prev;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('zerano_cart_next');
  };

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, wishlist, user, isAuthLoading,
      addToCart, removeFromCart, updateQuantity, toggleWishlist, clearCart,
      login, register, logout, refreshUser,
      cartTotal, cartCount
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

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

type StoreContextType = {
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  toggleWishlist: (product: Product) => void;
  cartTotal: number;
  cartCount: number;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('zerano_cart_next');
    const savedWishlist = localStorage.getItem('zerano_wishlist_next');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('zerano_cart_next', JSON.stringify(cart));
      localStorage.setItem('zerano_wishlist_next', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isMounted]);

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
    alert('Added to Cart'); // Basic toast
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

  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        alert('Removed from Wishlist');
        return prev.filter((item) => item.id !== product.id);
      }
      alert('Added to Wishlist');
      return [...prev, product];
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <StoreContext.Provider value={{ cart, wishlist, addToCart, removeFromCart, updateQuantity, toggleWishlist, cartTotal, cartCount }}>
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

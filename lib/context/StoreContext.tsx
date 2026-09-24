'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define the shape of our items
export type StoreItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
};

type StoreContextType = {
  cart: StoreItem[];
  wishlist: StoreItem[];
  cartTotal: number;
  cartCount: number;
  addToCart: (item: Omit<StoreItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (item: Omit<StoreItem, 'quantity'>) => void;
  isInWishlist: (id: string) => boolean;
  isHydrated: boolean; // Prevents hydration mismatch errors
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<StoreItem[]>([]);
  const [wishlist, setWishlist] = useState<StoreItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('essyrise_cart');
    const savedWishlist = localStorage.getItem('essyrise_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    setIsHydrated(true);
  }, []);

  // Save to LocalStorage whenever cart/wishlist changes
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('essyrise_cart', JSON.stringify(cart));
      localStorage.setItem('essyrise_wishlist', JSON.stringify(wishlist));
    }
  }, [cart, wishlist, isHydrated]);

  // Derived state
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Actions
  const addToCart = (product: Omit<StoreItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(id);
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (product: Omit<StoreItem, 'quantity'>) => {
    setWishlist((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.filter((item) => item.id !== product.id);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const isInWishlist = (id: string) => wishlist.some((item) => item.id === id);

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        cartTotal,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        isHydrated
      }}
    >
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

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Cart } from '@/types';

interface CartStore extends Cart {
  // Actions
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      updatedAt: new Date(),
      
      addItem: (newItem) => set((state) => {
        const existingItemIndex = state.items.findIndex(item => item.productId === newItem.productId);
        const quantity = newItem.quantity || 1;
        
        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedItems = [...state.items];
          const currentQuantity = updatedItems[existingItemIndex].quantity;
          const newQuantity = Math.min(currentQuantity + quantity, newItem.stock);
          
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: newQuantity,
          };
          
          return {
            items: updatedItems,
            updatedAt: new Date(),
          };
        } else {
          // Add new item
          const safeQuantity = Math.min(quantity, newItem.stock);
          return {
            items: [...state.items, { ...newItem, quantity: safeQuantity }],
            updatedAt: new Date(),
          };
        }
      }),
      
      updateItemQuantity: (productId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(item => item.productId !== productId),
            updatedAt: new Date(),
          };
        }
        
        const updatedItems = state.items.map(item => {
          if (item.productId === productId) {
            const safeQuantity = Math.min(quantity, item.stock);
            return { ...item, quantity: safeQuantity };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          updatedAt: new Date(),
        };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.productId !== productId),
        updatedAt: new Date(),
      })),
      
      clearCart: () => set({
        items: [],
        updatedAt: new Date(),
      }),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getItemCount: (productId) => {
        const { items } = get();
        const item = items.find(item => item.productId === productId);
        return item ? item.quantity : 0;
      },
      
      isInCart: (productId) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },
    }),
    {
      name: 'tiflun_cart_v1',
      partialize: (state) => ({
        items: state.items,
        updatedAt: state.updatedAt,
      }),
    }
  )
);

// Selectors for better performance
export const useCartItems = () => useCartStore(state => state.items);
export const useCartTotalItems = () => useCartStore(state => state.getTotalItems());
export const useCartTotalPrice = () => useCartStore(state => state.getTotalPrice());
export const useCartActions = () => useCartStore(state => ({
  addItem: state.addItem,
  updateItemQuantity: state.updateItemQuantity,
  removeItem: state.removeItem,
  clearCart: state.clearCart,
}));
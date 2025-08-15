'use client';

import { create } from 'zustand';
import type { UIState } from '@/types';

interface UIStore extends UIState {
  // Actions
  setCartDrawerOpen: (open: boolean) => void;
  toggleCartDrawer: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLoading: (loading: boolean) => void;
  
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Toast notifications
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
  }>;
  addToast: (toast: Omit<UIStore['toasts'][0], 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Modal states
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  setSearchResults: (results: any[]) => void;
  isSearching: boolean;
  setSearching: (searching: boolean) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  // Initial state
  cartDrawerOpen: false,
  theme: 'light',
  isLoading: false,
  currentPage: 'home',
  toasts: [],
  activeModal: null,
  searchQuery: '',
  searchResults: [],
  isSearching: false,
  
  // Cart drawer actions
  setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }),
  toggleCartDrawer: () => set((state) => ({ cartDrawerOpen: !state.cartDrawerOpen })),
  
  // Theme actions
  setTheme: (theme) => {
    set({ theme });
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else {
        // System theme
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (systemDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
      localStorage.setItem('tiflun-theme', theme);
    }
  },
  
  // Loading actions
  setLoading: (loading) => set({ isLoading: loading }),
  
  // Navigation actions
  setCurrentPage: (page) => set({ currentPage: page }),
  
  // Toast actions
  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto-remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      get().removeToast(id);
    }, duration);
  },
  
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(toast => toast.id !== id)
  })),
  
  // Modal actions
  setActiveModal: (modal) => set({ activeModal: modal }),
  
  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  setSearching: (searching) => set({ isSearching: searching }),
}));

// Selectors for better performance
export const useCartDrawerOpen = () => useUIStore(state => state.cartDrawerOpen);
export const useTheme = () => useUIStore(state => state.theme);
export const useIsLoading = () => useUIStore(state => state.isLoading);
export const useToasts = () => useUIStore(state => state.toasts);
export const useActiveModal = () => useUIStore(state => state.activeModal);

// Action selectors
export const useUIActions = () => useUIStore(state => ({
  setCartDrawerOpen: state.setCartDrawerOpen,
  toggleCartDrawer: state.toggleCartDrawer,
  setTheme: state.setTheme,
  setLoading: state.setLoading,
  addToast: state.addToast,
  removeToast: state.removeToast,
  setActiveModal: state.setActiveModal,
}));

export const useSearchState = () => useUIStore(state => ({
  query: state.searchQuery,
  results: state.searchResults,
  isSearching: state.isSearching,
  setQuery: state.setSearchQuery,
  setResults: state.setSearchResults,
  setSearching: state.setSearching,
}));
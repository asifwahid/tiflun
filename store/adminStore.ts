'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminSession } from '@/types';

interface AdminStore extends AdminSession {
  // Actions
  login: (user: { id: string; email: string }, token: string) => void;
  logout: () => void;
  setAuthenticated: (authenticated: boolean) => void;
  
  // UI state for admin
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  
  // Current admin page
  currentAdminPage: string;
  setCurrentAdminPage: (page: string) => void;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      // Initial state
      isAuthenticated: false,
      user: undefined,
      token: undefined,
      sidebarOpen: true,
      currentAdminPage: 'dashboard',
      
      // Authentication actions
      login: (user, token) => set({
        isAuthenticated: true,
        user,
        token,
      }),
      
      logout: () => set({
        isAuthenticated: false,
        user: undefined,
        token: undefined,
      }),
      
      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
      
      // UI actions
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      // Navigation actions
      setCurrentAdminPage: (page) => set({ currentAdminPage: page }),
    }),
    {
      name: 'tiflun-admin-session',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Selectors
export const useAdminAuth = () => useAdminStore(state => ({
  isAuthenticated: state.isAuthenticated,
  user: state.user,
  token: state.token,
}));

export const useAdminUI = () => useAdminStore(state => ({
  sidebarOpen: state.sidebarOpen,
  currentPage: state.currentAdminPage,
  setSidebarOpen: state.setSidebarOpen,
  toggleSidebar: state.toggleSidebar,
  setCurrentPage: state.setCurrentAdminPage,
}));

export const useAdminActions = () => useAdminStore(state => ({
  login: state.login,
  logout: state.logout,
  setAuthenticated: state.setAuthenticated,
}));
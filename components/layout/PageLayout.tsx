'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './Header';
import { BottomNavigation } from './BottomNavigation';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { cn } from '@/lib/utils';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  headerTransparent?: boolean;
  showBottomNav?: boolean;
  showHeader?: boolean;
}

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1],
  },
};

export function PageLayout({ 
  children, 
  className,
  headerTransparent = false,
  showBottomNav = true,
  showHeader = true,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-neumo-bg overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showHeader && (
          <Header transparent={headerTransparent} />
        )}
        
        <motion.main
          key="page-content"
          {...pageTransition}
          className={cn(
            'flex-1',
            showHeader && 'pt-16', // Account for fixed header
            showBottomNav && 'pb-24', // Account for bottom navigation
            className
          )}
        >
          {children}
        </motion.main>

        {showBottomNav && (
          <BottomNavigation />
        )}
        
        <CartDrawer />
      </AnimatePresence>
    </div>
  );
}

// Layout variants for different page types
export function HomeLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <PageLayout 
      headerTransparent 
      className={className}
    >
      {children}
    </PageLayout>
  );
}

export function ProductLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <PageLayout 
      className={className}
    >
      {children}
    </PageLayout>
  );
}

export function CheckoutLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <PageLayout 
      showBottomNav={false}
      className={className}
    >
      {children}
    </PageLayout>
  );
}

export function AdminLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('min-h-screen bg-neumo-bg', className)}>
      {children}
    </div>
  );
}
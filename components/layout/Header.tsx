'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartTotalItems } from '@/store/cartStore';
import { useUIActions } from '@/store/uiStore';
import { cn } from '@/lib/utils';

interface HeaderProps {
  transparent?: boolean;
  className?: string;
}

export function Header({ transparent = false, className }: HeaderProps) {
  const cartItemsCount = useCartTotalItems();
  const { toggleCartDrawer } = useUIActions();

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
      transparent 
        ? 'bg-transparent' 
        : 'neumo-surface backdrop-blur-md border-b border-border/20',
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 neumo-focus rounded-neumo-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-2xl font-bold text-brand-primary"
            >
              Tiflun
            </motion.div>
          </Link>

          {/* Desktop Navigation - Hidden on mobile since we use bottom nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-brand-primary transition-colors neumo-focus rounded-neumo-sm px-3 py-2"
            >
              Home
            </Link>
            <Link 
              href="/track" 
              className="text-foreground hover:text-brand-primary transition-colors neumo-focus rounded-neumo-sm px-3 py-2"
            >
              Track Order
            </Link>
          </nav>

          {/* Desktop Cart Button */}
          <div className="hidden md:flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCartDrawer}
              className="relative neumo-interactive"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 h-5 w-5 bg-brand-error text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
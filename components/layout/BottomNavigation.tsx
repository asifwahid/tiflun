'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Search, 
  ShoppingBag, 
  Package,
  User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCartTotalItems } from '@/store/cartStore';
import { useUIActions } from '@/store/uiStore';

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    href: '/',
  },
  {
    id: 'search',
    label: 'Search',
    icon: Search,
    href: '/search',
  },
  {
    id: 'cart',
    label: 'Cart',
    icon: ShoppingBag,
    action: 'cart',
  },
  {
    id: 'track',
    label: 'Track',
    icon: Package,
    href: '/track',
  },
  {
    id: 'account',
    label: 'Account',
    icon: User,
    href: '/account',
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const cartItemsCount = useCartTotalItems();
  const { toggleCartDrawer } = useUIActions();

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.action === 'cart') {
      toggleCartDrawer();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 neumo-surface border-t border-border/20 mobile-safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href ? pathname === item.href : false;
          const isCart = item.id === 'cart';

          return (
            <div key={item.id} className="relative flex-1">
              {item.href ? (
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 rounded-neumo-sm transition-all duration-200 neumo-focus',
                    isActive 
                      ? 'neumo-pressed text-brand-primary' 
                      : 'text-muted-foreground hover:text-foreground neumo-interactive'
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'flex flex-col items-center justify-center py-2 px-3 rounded-neumo-sm transition-all duration-200 neumo-focus relative',
                    'text-muted-foreground hover:text-foreground neumo-interactive'
                  )}
                >
                  <div className="relative">
                    <Icon className="h-5 w-5 mb-1" />
                    {isCart && cartItemsCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 h-5 w-5 bg-brand-error text-white text-xs font-bold rounded-full flex items-center justify-center shadow-neumo-sm"
                      >
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </motion.div>
                    )}
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              )}

              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-brand-primary rounded-full shadow-neumo-sm"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
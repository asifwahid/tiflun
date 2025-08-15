'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProductGrid } from '@/components/product/ProductGrid';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import type { Product } from '@/types';
import { getProducts } from '@/lib/firestore';
import { useUIActions } from '@/store/uiStore';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useUIActions();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setGlobalLoading(true);
        
        // Load featured and new products in parallel
        const [featuredResult, newResult] = await Promise.all([
          getProducts(8, undefined, { status: 'active' }),
          getProducts(8, undefined, { status: 'active' }),
        ]);

        // Filter featured products (this would normally be done with a Firestore query)
        const featured = featuredResult.products.filter(p => p.featureFlags?.isFeatured);
        const newItems = newResult.products.filter(p => p.featureFlags?.isNew);

        setFeaturedProducts(featured.slice(0, 6));
        setNewProducts(newItems.slice(0, 6));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
        setGlobalLoading(false);
      }
    };

    loadProducts();
  }, [setGlobalLoading]);

  return (
    <PageLayout headerTransparent>
      <div className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4"
              >
                Why Choose Tiflun?
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground max-w-2xl mx-auto"
              >
                Experience shopping reimagined with our cutting-edge mobile platform
              </motion.p>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  icon: Sparkles,
                  title: 'Premium Design',
                  description: 'Beautiful, tactile interface that feels natural and intuitive',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'Optimized for speed with instant loading and smooth animations',
                },
                {
                  icon: Shield,
                  title: 'Secure & Trusted',
                  description: 'Your data is protected with enterprise-grade security',
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  variants={fadeInUp}
                  className="text-center group"
                >
                  <div className="neumo-surface p-8 rounded-neumo-lg neumo-interactive mb-6 inline-block">
                    <feature.icon className="h-12 w-12 text-brand-primary mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <FeaturedProducts products={featuredProducts} loading={loading} />
        )}

        {/* Categories */}
        <CategoryGrid />

        {/* New Arrivals */}
        {newProducts.length > 0 && (
          <section className="py-16 px-4 bg-gradient-to-b from-transparent to-neumo-bg/30">
            <div className="container mx-auto max-w-6xl">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <motion.h2 
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl font-bold text-foreground mb-4"
                >
                  New Arrivals
                </motion.h2>
                <motion.p 
                  variants={fadeInUp}
                  className="text-lg text-muted-foreground mb-8"
                >
                  Discover the latest additions to our collection
                </motion.p>
              </motion.div>

              <ProductGrid products={newProducts} loading={loading} />

              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center mt-12"
              >
                <Button 
                  size="lg" 
                  variant="primary"
                  className="group"
                >
                  View All Products
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-t from-brand-primary/10 to-transparent">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.h2 
                variants={fadeInUp}
                className="text-3xl md:text-4xl font-bold text-foreground mb-6"
              >
                Ready to Start Shopping?
              </motion.h2>
              <motion.p 
                variants={fadeInUp}
                className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto"
              >
                Join thousands of satisfied customers and experience the future of mobile commerce
              </motion.p>
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Button 
                  size="xl" 
                  variant="primary"
                  className="group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  size="xl" 
                  variant="outline"
                >
                  Track Your Order
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
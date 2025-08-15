import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Tiflun - Premium Mobile Commerce',
  description: 'Experience shopping like never before with our mobile-first, beautifully designed ecommerce platform.',
  keywords: ['ecommerce', 'shopping', 'mobile', 'premium', 'products'],
  authors: [{ name: 'Tiflun Team' }],
  creator: 'Tiflun',
  publisher: 'Tiflun',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#E5E9F2',
  colorScheme: 'light dark',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tiflun.com',
    siteName: 'Tiflun',
    title: 'Tiflun - Premium Mobile Commerce',
    description: 'Experience shopping like never before with our mobile-first, beautifully designed ecommerce platform.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiflun - Premium Mobile Commerce',
    description: 'Experience shopping like never before with our mobile-first, beautifully designed ecommerce platform.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, 'scroll-smooth')}>
      <body className={cn(
        'font-inter antialiased bg-neumo-bg text-foreground overflow-x-hidden',
        'selection:bg-brand-primary/20 selection:text-brand-primary'
      )}>
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}
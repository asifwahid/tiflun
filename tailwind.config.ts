import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Neumorphic base colors
        neumo: {
          bg: '#E5E9F2',
          'bg-dark': '#2C2F36',
          light: '#FFFFFF',
          'light-dark': '#383B42',
          shadow: '#A3B1C6',
          'shadow-dark': '#1E2025',
        },
        // Brand colors
        brand: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        // Neumorphic shadows
        'neumo-sm': '4px 4px 8px rgba(163, 177, 198, 0.4), -4px -4px 8px rgba(255, 255, 255, 0.9)',
        'neumo': '10px 10px 25px rgba(163, 177, 198, 0.6), -10px -10px 25px rgba(255, 255, 255, 0.9)',
        'neumo-lg': '15px 15px 35px rgba(163, 177, 198, 0.7), -15px -15px 35px rgba(255, 255, 255, 0.9)',
        'neumo-xl': '20px 20px 45px rgba(163, 177, 198, 0.8), -20px -20px 45px rgba(255, 255, 255, 0.9)',
        'neumo-inset': 'inset 6px 6px 12px rgba(163, 177, 198, 0.55), inset -6px -6px 12px rgba(255, 255, 255, 0.9)',
        'neumo-inset-sm': 'inset 3px 3px 6px rgba(163, 177, 198, 0.5), inset -3px -3px 6px rgba(255, 255, 255, 0.8)',
        // Dark mode variants
        'neumo-dark': '10px 10px 25px rgba(30, 32, 37, 0.8), -10px -10px 25px rgba(56, 59, 66, 0.3)',
        'neumo-dark-inset': 'inset 6px 6px 12px rgba(30, 32, 37, 0.7), inset -6px -6px 12px rgba(56, 59, 66, 0.3)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        'neumo': '20px',
        'neumo-sm': '12px',
        'neumo-lg': '28px',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-neumo': 'pulse-neumo 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'pulse-neumo': {
          '0%, 100%': {
            boxShadow: '10px 10px 25px rgba(163, 177, 198, 0.6), -10px -10px 25px rgba(255, 255, 255, 0.9)',
          },
          '50%': {
            boxShadow: '15px 15px 35px rgba(163, 177, 198, 0.8), -15px -15px 35px rgba(255, 255, 255, 0.95)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
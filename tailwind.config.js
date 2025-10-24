/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          glow: 'hsl(var(--primary-glow))',
          dark: 'hsl(var(--primary-dark))',
          foreground: 'hsl(var(--background))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        success: 'hsl(var(--success))',
        warning: 'hsl(var(--warning))',
        destructive: 'hsl(var(--destructive))',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        glow: 'var(--shadow-glow)',
        card: 'var(--shadow-card)',
        elevated: 'var(--shadow-elevated)',
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'blink': 'blink 1s step-end infinite',
        'fadeInUp': 'fadeInUp 0.6s ease-out',
      },
      fontFamily: {
        mono: ['Fira Code', 'Space Mono', 'monospace'],
        code: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-matrix': 'var(--gradient-matrix)',
        'gradient-glow': 'var(--gradient-glow)',
        'gradient-hero': 'var(--gradient-hero)',
      },
      transitionTimingFunction: {
        smooth: 'var(--transition-smooth)',
        bounce: 'var(--transition-bounce)',
      },
    },
  },
  plugins: [],
};
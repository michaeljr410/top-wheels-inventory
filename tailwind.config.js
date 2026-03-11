/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyan: {
          DEFAULT: '#0EA5E9',
          light: '#38BDF8',
          dim: '#0284C7',
          glow: 'rgba(14,165,233,0.15)',
        },
        teal: '#06B6D4',
        dark: {
          DEFAULT: '#060B18',
          card: '#0A1020',
          elevated: '#0E1530',
          border: '#152040',
        },
        navy: '#0A0F1C',
        tw: {
          text: '#E2E8F0',
          dim: '#8494A7',
          muted: '#4A5568',
          white: '#F8FAFC',
        },
      },
      fontFamily: {
        heading: ['"Bebas Neue"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'float': 'float 9s ease-in-out infinite',
        'float-reverse': 'float 11s ease-in-out infinite reverse',
        'pulse-dot': 'pulse 2s infinite',
        'fade-in-up': 'fadeInUp 0.8s ease both',
        'draw-line': 'drawLine 1.2s ease 1s both',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(40px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        drawLine: {
          from: { width: '0' },
          to: { width: '100%' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14,165,233,0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(14,165,233,0.25), 0 0 80px rgba(14,165,233,0.08)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

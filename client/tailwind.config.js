/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces — near-black, slightly warm, never pure #000
        base: {
          950: '#0A0B10',
          900: '#0F1117',
          800: '#161923',
          700: '#1E2230',
          600: '#2A2F42',
          border: '#272B3A',
        },
        // Signature indigo/violet gradient family (primary accent)
        signal: {
          400: '#9C8CFF',
          500: '#7C6CF6',
          600: '#5F4DDE',
          700: '#4B3BC4',
        },
        // Warm coral — reserved for primary CTAs (Run, Get Started) so it never
        // reads as generic blue/white
        ember: {
          400: '#FF8C6B',
          500: '#FF6B4A',
          600: '#E8532F',
        },
        // Status colors
        mint: '#4ADE80',
        rose: '#FB7185',
        amber: '#FBBF24',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'signal-gradient': 'linear-gradient(135deg, #7C6CF6 0%, #5F4DDE 50%, #4B3BC4 100%)',
        'ember-gradient': 'linear-gradient(135deg, #FF8C6B 0%, #FF6B4A 100%)',
        'mesh-glow':
          'radial-gradient(circle at 20% 20%, rgba(124,108,246,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 0%, rgba(255,107,74,0.10) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(124,108,246,0.12) 0%, transparent 50%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,108,246,0.15), 0 8px 30px rgba(124,108,246,0.15)',
        'glow-ember': '0 0 0 1px rgba(255,107,74,0.2), 0 8px 24px rgba(255,107,74,0.25)',
        card: '0 1px 0 rgba(255,255,255,0.03) inset, 0 10px 30px rgba(0,0,0,0.35)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        typeIn: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        blink: 'blink 1s step-start infinite',
        floatY: 'floatY 4s ease-in-out infinite',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

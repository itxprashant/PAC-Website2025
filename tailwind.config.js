/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        'space-black': '#0B0C15',
        'deep-space': '#131426',
        'nebula-purple': '#7C3AED',
        'nebula-blue': '#3B82F6',
        'star-gold': '#F59E0B',
        'cosmic-glass': 'rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-cosmic': 'linear-gradient(to bottom right, #0B0C15, #131426)',
      }
    },
  },
  plugins: [],
};

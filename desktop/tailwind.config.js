/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/renderer/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/renderer/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        card: '#111827',
        border: '#1F2937',
        accent: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

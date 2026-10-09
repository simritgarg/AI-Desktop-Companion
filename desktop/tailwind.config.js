/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/renderer/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/renderer/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/renderer/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FFFFFF',
        surface: '#F5F1EA',      // Linen
        card: '#FFFFFF',
        border: '#E8E0D5',
        'border-strong': '#D7C9B8',
        linen:    '#F5F1EA',
        khaki:    '#D7C9B8',
        camel:    '#B2967D',
        cocoa:    '#7D5A44',
        espresso: '#4A342A',
        coffee: {
          50:  '#FBF8F4',
          100: '#F5F1EA',   // Linen
          200: '#EBE3D8',
          300: '#D7C9B8',   // Khaki
          400: '#C4AE98',
          500: '#B2967D',   // Camel
          600: '#9A7D63',
          700: '#7D5A44',   // Cocoa
          800: '#5E4233',
          900: '#4A342A',   // Espresso
          950: '#362520',
        },
        accent: {
          warm:    '#B2967D',  // Camel
          primary: '#7D5A44',  // Cocoa
          deep:    '#4A342A',  // Espresso
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'soft':   '0 1px 3px 0 rgba(74,52,42,0.04), 0 1px 2px -1px rgba(74,52,42,0.04)',
        'medium': '0 4px 12px -2px rgba(74,52,42,0.08), 0 2px 6px -2px rgba(74,52,42,0.04)',
        'strong': '0 10px 25px -3px rgba(74,52,42,0.10), 0 4px 10px -4px rgba(74,52,42,0.06)',
      },
      animation: {
        'bounce-slow':  'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 3s ease-in-out infinite',
        'fade-in-up':   'fadeInUp 0.4s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

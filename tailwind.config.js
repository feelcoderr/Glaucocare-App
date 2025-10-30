/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Primary gradient colors for logo and main elements
        primary: {
          50: '#f0f7ff',
          100: '#e0efff',
          500: '#2B3C8D', // Primary dark blue
          600: '#1672BC', // Primary light blue
          700: '#003b73', // Text/contrast buttons
        },
        // Secondary colors
        secondary: {
          50: '#f8fafc',
          100: '#b3e5fc', // Background/secondary accents
          200: '#fafafa', // Background accessible screens
          500: '#008080', // Accents/links/alerts (teal)
          600: '#6e7b8b', // Subtle borders/secondary text
        },
        // Custom GlaucoCare colors
        glaucoma: {
          primary: '#2B3C8D',
          primaryLight: '#1672BC',
          accent: '#b3e5fc',
          background: '#fafafa',
          teal: '#008080',
          textPrimary: '#003b73',
          textSecondary: '#6e7b8b',
          border: '#6e7b8b',
        },
      },
      fontFamily: {
        // Poppins font family as shown in design
        'poppins-light': ['Poppins_300Light'],
        'poppins-regular': ['Poppins_400Regular'],
        'poppins-medium': ['Poppins_500Medium'],
        'poppins-semibold': ['Poppins_600SemiBold'],
        'poppins-bold': ['Poppins_700Bold'],
      },
      fontSize: {
        // Custom font sizes based on design
        'heading-1': ['24px', { lineHeight: '32px', fontWeight: '700' }], // Bold
        'heading-2': ['21px', { lineHeight: '28px', fontWeight: '600' }], // SemiBold
        'heading-3': ['18px', { lineHeight: '24px', fontWeight: '600' }], // SemiBold
        'heading-4': ['16px', { lineHeight: '22px', fontWeight: '600' }], // SemiBold
        'heading-5': ['14px', { lineHeight: '20px', fontWeight: '600' }], // SemiBold
        'body-regular': ['16px', { lineHeight: '24px', fontWeight: '400' }], // Regular
        'body-small': ['14px', { lineHeight: '20px', fontWeight: '400' }], // Regular
        'body-xs': ['12px', { lineHeight: '18px', fontWeight: '400' }], // Regular
        button: ['16px', { lineHeight: '20px', fontWeight: '600' }], // SemiBold
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }], // Regular
      },
      spacing: {
        // Consistent spacing system
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        button: '0 2px 4px rgba(43, 60, 141, 0.2)',
      },
    },
  },
  plugins: [],
};

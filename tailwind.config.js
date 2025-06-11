// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // Add other files where you use Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // Define 'inter' custom font family
      },
      colors: {
        // Define a custom primary color, e.g., a nice blue
        primary: {
          50: '#e0f2fe',
          100: '#bfdbfe',
          200: '#93c5fd',
          300: '#60a5fa',
          400: '#3b82f6',
          500: '#2563eb', // A good default blue
          600: '#1d4ed8',
          700: '#1e40af',
          800: '#1e3a8a',
          900: '#1e306f',
        },
        // Re-aligning with your dark theme for clarity
        darkBg: '#111827',
        darkText: '#f3f4f6',
        darkSecondary: '#1f2937', // A slightly lighter dark for cards, etc.
        darkBorder: '#374151',
      },
    },
  },
  plugins: [],
}
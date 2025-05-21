/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        lg: "8rem",
        
      }
    },
    extend: {
      colors:{
        primary: '#F2B960',
        secondary: '#141842',
        darkgray: '#8C8C8C'
      },
      fontFamily: {
        Plus: ["Plus Jakarta Sans", "sans-serif"],
        Poppins: ['Poppins', 'sans-serif'],
        // Mont: ["Montserrat", "sans-serif"],
        // Roboto:["Roboto","sans-serif"],
        // Satisfy: ["Satisfy"]
        // sans: ['var(--font-roboto)', 'ui-sans-serif', 'system-ui'],
        satisfy: ['var(--font-satisfy)', 'cursive'],
      },
      textStroke: {
        sm: '1px', // Small stroke
        md: '2px', // Medium stroke
        lg: '3px', // Large stroke
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.text-stroke-sm': {
          '-webkit-text-stroke': '1px white',
          "color": "transparent"
        },
        '.text-stroke-md': {
          '-webkit-text-stroke': '2px white',
          "color": "transparent"

        },
        '.text-stroke-lg': {
          '-webkit-text-stroke': '3px white',
          "color": "transparent"

        },
      });
    },
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Ensure all styles are included
  safelist: [
    'bg-blue-600',
    'text-white',
    'bg-blue-700',
    'bg-blue-100',
    'text-blue-800',
    'bg-green-100',
    'text-green-800',
    'bg-red-50',
    'bg-red-100',
    'text-red-500',
    'text-red-700',
    'text-red-800',
    'border-red-200',
    'border-gray-200',
    'bg-gradient-to-b',
    'from-gray-50',
    'to-gray-100'
  ]
}

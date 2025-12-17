/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pricing-widget/src/**/*.{ts,tsx}"],
  important: ".ss-pricing",
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};

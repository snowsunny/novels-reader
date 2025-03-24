/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./novels-reader-crx/html/options.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // "./node_modules/flowbite/**/*.js" // options.vueに書いたのと同じ理由でコメントアウト
  ],
  theme: {
  },
  plugins: [
    require('flowbite/plugin')
  ]
}

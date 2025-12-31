/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                background: '#0F172A',
                primary: '#4F46E5',
                secondary: '#EC4899',
                accent: '#22D3EE',
            },
        },
    },
    plugins: [],
}

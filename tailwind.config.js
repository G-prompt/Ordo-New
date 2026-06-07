module.exports = {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#fbf8ff',
                    100: '#f3eeff',
                    500: '#c4b5fd',
                    600: '#a78bfa',
                    700: '#7c3aed',
                    800: '#5b21b6'
                },
                accent: {
                    500: '#d6bcfa',
                    600: '#c084fc',
                    700: '#9f7aea',
                    800: '#7c3aed'
                }
            },
            boxShadow: {
                soft: '0 24px 80px rgba(15, 23, 42, 0.08)',
                premium: '0 20px 60px rgba(168, 85, 247, 0.15)',
            },
        }
    },
    plugins: [],
};

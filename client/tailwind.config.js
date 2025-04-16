/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{js,ts,jsx,tsx,html,mdx}'],
    darkMode: 'class',
    theme: {
        screens: {
            xl: { max: '1650px' },
            lg: { max: '1500px' },
            mdlg: { max: '1300px' },
            md: { max: '1050px' },
            smd: { max: '750px' },
            sm: { max: '550px' },
            xs: { max: '450px' }
        },
        extend: {
            colors: {
                open_border: '#B6B6B6'
            },
            fontSize: {
                heading4Xl: ['40px', '48px'],
                heading3Xl: ['32px', '40px'],
                heading2Xl: ['28px', '32px'],
                headingXl: ['24px', '28px'],
                headingLg: ['20px', '24px'],
                headingMd: ['16px', '20px'],
                headingSm: ['14px', '16px'],
                headingXs: ['12px', '16px'],
                bodyLg: ['16px', '24px'],
                bodyMd: ['14px', '20px'],
                bodySm: ['12px', '18px'],
                bodyXs: ['11px', '14px']
            },
            boxShadow: {
                card: '0px 2px 1px 0px #0000000d',
                button: '0px 1px 0px 0px rgba(0, 0, 0, 0.05)'
            },
            transitionProperty: {
                width: 'width',
                transition: 'transition'
            },
            borderWidth: {
                1: '1px',
                1.5: '1.5px'
            },
            spacing: {
                800: '800px',
                50: '196px'
            }
        }
    },
    plugins: []
};

const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

module.exports = {
  experimental: {
    optimizeUniversalDefaults: true,
  },
  content: [
    './pages/**/*.js',
    './components/**/*.js',
    './layouts/**/*.js',
    './lib/**/*.js',
    './data/**/*.mdx',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      spacing: {
        '9/16': '56.25%',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        sans: ['InterVariable', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.teal,
        gray: colors.neutral,
        'custom-green': "#29e88c",
        'dark-bg': "rgb(32, 32, 32)",
        'light-bg': "rgb(255, 255, 255)"
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h1: {
              fontWeight: '700',
              fontSize: '1.5rem'
            },
            h2: {
              fontSize: '1.25rem'
            },
            h3: {
              fontSize: '1.15rem'
            },
            'h4,h5,h6': {
              color: theme('colors.gray.900'),
            },
            pre: {
              // backgroundColor: theme('colors.gray.800'),
            },
            code: {
              paddingLeft: '4px',
              paddingRight: '4px',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
          },
        },
        // dark: {
        //   css: {
        //     color: theme('colors.gray.300'),
        //     a: {
        //       color: theme('colors.primary.500'),
        //       '&:hover': {
        //         color: `${theme('colors.primary.400')} !important`,
        //       },
        //       code: { color: theme('colors.primary.400') },
        //     },
        //     h1: {
        //       fontWeight: '700',
        //       letterSpacing: theme('letterSpacing.tight'),
        //       color: theme('colors.gray.100'),
        //     },
        //     h2: {
        //       fontWeight: '700',
        //       letterSpacing: theme('letterSpacing.tight'),
        //       color: theme('colors.gray.100'),
        //     },
        //     h3: {
        //       fontWeight: '600',
        //       color: theme('colors.gray.100'),
        //     },
        //     'h4,h5,h6': {
        //       color: theme('colors.gray.100'),
        //     },
        //     pre: {
        //       backgroundColor: theme('colors.gray.800'),
        //     },
        //     code: {
        //       backgroundColor: theme('colors.gray.800'),
        //     },
        //     details: {
        //       backgroundColor: theme('colors.gray.800'),
        //     },
        //     hr: { borderColor: theme('colors.gray.700') },
        //     'ol li::marker': {
        //       fontWeight: '600',
        //       color: theme('colors.gray.400'),
        //     },
        //     'ul li::marker': {
        //       backgroundColor: theme('colors.gray.400'),
        //     },
        //     strong: { color: theme('colors.gray.100') },
        //     thead: {
        //       th: {
        //         color: theme('colors.gray.100'),
        //       },
        //     },
        //     tbody: {
        //       tr: {
        //         borderBottomColor: theme('colors.gray.700'),
        //       },
        //     },
        //     blockquote: {
        //       color: theme('colors.gray.100'),
        //       borderLeftColor: theme('colors.gray.700'),
        //     },
        //   },
        // },
      }),
      keyframes: {
        "fadein-b": {
          '0%': { opacity: 0.001, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0px)' },
        },
        "opacity": {
          '0%': { opacity: 0.001 },
          '100%': { opacity: 1 },
        }
      },
      animation: {
        'fadein-b': 'fadein-b 1s ease-in-out',
        opacity: 'opacity 1s ease-in-out .5s forwards',
      }
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}

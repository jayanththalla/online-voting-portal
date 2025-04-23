/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: '#FF6B35',
  				foreground: 'hsl(var(--primary-foreground))',
  				50: '#FFF3EE',
  				100: '#FFE6D9',
  				200: '#FFD0B5',
  				300: '#FFB088',
  				400: '#FF8F5F',
  				500: '#FF6B35',
  				600: '#FF4D0D',
  				700: '#E53D00',
  				800: '#B83000',
  				900: '#8A2400',
  			},
  			secondary: {
  				DEFAULT: '#046B99',
  				foreground: 'hsl(var(--secondary-foreground))',
  				50: '#E6F3F9',
  				100: '#CCE7F2',
  				200: '#99CFE6',
  				300: '#66B7D9',
  				400: '#339FCC',
  				500: '#0087BF',
  				600: '#046B99',
  				700: '#035780',
  				800: '#024366',
  				900: '#01304D',
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: '#4CAF50',
  				foreground: 'hsl(var(--accent-foreground))',
  				50: '#E8F5E9',
  				100: '#C8E6C9',
  				200: '#A5D6A7',
  				300: '#81C784',
  				400: '#66BB6A',
  				500: '#4CAF50',
  				600: '#43A047',
  				700: '#388E3C',
  				800: '#2E7D32',
  				900: '#1B5E20',
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			gradient: {
  				'0%': { backgroundPosition: '0% 50%' },
  				'50%': { backgroundPosition: '100% 50%' },
  				'100%': { backgroundPosition: '0% 50%' },
  			},
  			float: {
  				'0%, 100%': { transform: 'translateY(0)' },
  				'50%': { transform: 'translateY(-10px)' },
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'gradient': 'gradient 15s ease infinite',
  			'float': 'float 3s ease-in-out infinite',
  		},
  		backgroundImage: {
  			'hero-pattern': "url('/images/vote-india.png')",
  			'isometric-pattern': "url('/images/elections-voting-isometric.png')",
  			'vote-illustration': "url('/images/vote-illustration.png')",
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 
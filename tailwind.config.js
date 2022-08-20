// tailwind.config.js
module.exports = {
	important: true,
	purge: {
		content: ['./src/**/*.html', './src/**/*.vue'],
		options: {
			whitelist: [
				'bg-red-500',
				'px-4',
				'body',
				'html',
				'img',
				'a',
				'g-image',
				'g-image--lazy',
				'g-image--loaded',
				'w-6',
				'h-6',
				'w-10',
				'h-10',
			],
		},
	},
	theme: {
		extend: {
			colors: {
				primary: '#4a5568',
				link: '#6e9c88',
			},
			maxWidth: {
				'1000': '1000px',
			},
			spacing: {
				'1/10': '10%',
				'1/5': '20%',
				'1/4': '25%',
			},
			inset: {
				'-32': '-8rem',
				'-16': '-4rem',
			},
		},
	},
	variants: {
		opacity: ['responsive', 'hover'],
	},
	plugins: [require('@tailwindcss/custom-forms')],
}

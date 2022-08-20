class TailwindExtractor {
	static extract(content) {
		return content.match(/[A-z0-9-:\\/]+/g)
	}
}

module.exports = {
	content: [
		'./src/**/*.vue',
		'./src/**/*.js',
		'./src/**/*.jsx',
		'./src/**/*.html',
		'./src/**/*.pug',
		'./src/**/*.md'
	],
	whitelist: [
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
		'h-10'
	],
	extractors: [
		{
			extractor: TailwindExtractor,
			extensions: ['vue', 'js', 'jsx', 'md', 'html', 'pug']
		}
	]
}

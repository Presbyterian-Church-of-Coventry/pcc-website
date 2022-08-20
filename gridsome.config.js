// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here requires a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const tailwind = require('tailwindcss')
const postcssNested = require('postcss-nested')
const postcssPlugins = [tailwind(), postcssNested()]

const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone') // dependent on utc plugin
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/New_York')

module.exports = {
	siteName: 'Presbyterian Church of Coventry',
	siteDescription:
		'The Presbyterian Church of Coventry is a congregation of The Presbyterian Church in America.',
	titleTemplate: '%s — Presbyterian Church of Coventry',
	icon: 'src/pcc-favicon.png',
	transformers: {
		remark: {
			externalLinksTarget: '_blank',
			externalLinksRel: ['nofollow', 'noopener', 'noreferrer'],
			anchorClassName: 'mdi mdi-pound',
			plugins: [
				// ...global plugins
				'remark-breaks',
			],
		},
	},
	permalinks: {
		trailingSlash: false,
	},
	chainWebpack: (config) => {
		const svgRule = config.module.rule('svg')
		svgRule.uses.clear()
		svgRule.use('vue-svg-loader').loader('vue-svg-loader')
	},
	templates: {
		Bulletin: '/bulletin/:title',
		Sermon: '/sermons/:year/:month/:title',
		Series: '/sermons/series/:title',
		Preacher: '/sermons/preachers/:id',
		Event: '/event/:title',
		Misc: '/misc/:title',
		VBSDay: '/vbs/:slug',
	},
	plugins: [
		// Podcast RSS (iTunes compatability)
		{
			use: 'gridsome-plugin-rss',
			options: {
				contentTypeName: 'Sermon',
				feedOptions: {
					title: 'Presbyterian Church of Coventry',
					description:
						'Sermons preached at the Presbyterian Church of Coventry (Connecticut, USA).',
					feed_url: 'https://coventrypca.church/podcast.xml',
					site_url: 'https://coventrypca.church',
					language: 'en',
					custom_namespaces: {
						itunes: 'http://www.itunes.com/dtds/podcast-1.0.dtd',
					},
					custom_elements: [
						{
							'itunes:subtitle':
								'Sermons preached at the Presbyterian Church of Coventry (Connecticut, USA).',
						},
						{ 'itunes:author': 'Will Snyder' },
						{
							'itunes:summary':
								'Sermons preached at the Presbyterian Church of Coventry (Connecticut, USA). Sermons are posted on the same day they are preached (every Sunday).',
						},
						{
							'itunes:owner': [
								{ 'itunes:name': 'Cody Barr' },
								{ 'itunes:email': 'admin@coventrypca.church' },
							],
						},
						{
							'itunes:image': {
								_attr: {
									href:
										'https://coventrypca.church/podcast.jpg',
								},
							},
						},
						{
							'itunes:explicit': 'No',
						},
						{
							'itunes:category': [
								{
									_attr: {
										text: 'Religion & Spirituality',
									},
								},
								{
									'itunes:category': {
										_attr: {
											text: 'Christianity',
										},
									},
								},
							],
						},
					],
				},
				feedItemOptions: (node) => ({
					title: node.title,
					description: node.description,
					url: `https://pcc.netlify.com${node.path}`,
					author: node.preacher,
					date: dayjs(node.date).toISOString(),
					enclosure: {
						url: encodeURI(node.audio),
						type: 'audio/mp3',
					},
					custom_elements: [{ 'itunes:author': node.preacher }],
				}),
				output: {
					dir: './static',
					name: 'podcast.xml',
				},
			},
		},
		// Sermons
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/sermons/**/*.md',
				typeName: 'Sermon',
				refs: {
					series: 'Series',
					preacher: 'Preacher',
				},
			},
		},
		// Sermon Series
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/series/**/*.md',
				typeName: 'Series',
			},
		},
		// Preacher
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/preachers/**/*.md',
				typeName: 'Preacher',
			},
		},
		// About Pages
		{
			use: '@gridsome/source-filesystem',
			options: {
				baseDir: 'content',
				path: 'about/*.md',
				typeName: 'AboutPage',
			},
		},
		// Ministry Pages
		{
			use: '@gridsome/source-filesystem',
			options: {
				baseDir: 'content',
				path: 'ministries/*.md',
				typeName: 'MinistriesPage',
			},
		},
		// Events
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/events/**/*.md',
				typeName: 'Event',
			},
		},
		// VBS Pages
		{
			use: '@gridsome/source-filesystem',
			options: {
				baseDir: 'content',
				path: 'vbs/**/*.md',
				typeName: 'VBSDay',
			},
		},
		// Misc
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/misc/**/*.md',
				typeName: 'Misc',
			},
		},
		// Settings (for site settings - like the sitewide alert)
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/settings/**/*.md',
				typeName: 'Settings',
			},
		},
		// Current Series
		{
			use: '@gridsome/source-filesystem',
			options: {
				path: 'content/settings/current-series.md',
				typeName: 'CurrentSeries',
				refs: {
					series: 'Series',
				},
			},
		},
	],
	css: {
		loaderOptions: {
			postcss: {
				plugins: postcssPlugins,
			},
		},
	},
}

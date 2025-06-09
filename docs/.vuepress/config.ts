import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { markdownExtPlugin } from '@vuepress/plugin-markdown-ext';
import { markdownTabPlugin } from '@vuepress/plugin-markdown-tab';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { searchPlugin } from '@vuepress/plugin-search';
import { usePagesPlugin } from 'vuepress-plugin-use-pages';
import { readingTimePlugin } from '@vuepress/plugin-reading-time';
import { getDirname, path } from '@vuepress/utils';
import matter from 'gray-matter';

import fs from 'fs';
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
	bundler: viteBundler({
		viteOptions: {
			resolve: {
				alias: {
					'@theme/VPHomeHero.vue': path.resolve(__dirname, 'layouts/HomeHero.vue'),
					'@theme/Layout.vue': path.resolve(__dirname, 'layouts/Layout.vue'),
				}
			}
		}
	}),
	lang: 'en-AU',
	title: 'Time for Testing',
	head: [
		// Plausible queue script (should come first)
		[
			'script',
			{},
			'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }'
		],
		// Main Plausible script
		[
			'script',
			{
				defer: true,
				'data-domain': 'timefortesting.net',
				src: 'https://plausible.io/js/script.hash.outbound-links.pageview-props.tagged-events.js'
			}
		]
	],
	theme: defaultTheme({
		repo: 'doubleedesign/testing-notebook',
		repoLabel: 'GitHub',
		editLink: false,
		navbar: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'Why?',
				link: '/benefits.md',
			},
			{
				text: 'What?',
				link: '/concepts/pyramid.html',
			},
			{
				text: 'How?',
				link: '/examples/overview.html',
			},
			{
				text: 'About',
				link: '/about.html',
			}
		],
		sidebarDepth: 1,
		sidebar: [
			{
				text: 'Why automated testing?',
				link: '/benefits.md'
			},
			{
				text: 'Concepts',
				collapsible: true,
				children: getPagesFromSubfolder(path.resolve(__dirname, '../concepts')),
			},
			{
				text: 'Getting Started',
				link: '/setup.html',
			},
			{
				text: 'Tooling Deep Dives',
				link: '/tooling/overview.html',
				collapsible: true,
				children: getPagesFromSubfolder(path.resolve(__dirname, '../tooling')),
			},
			{
				text: 'Examples',
				link: '/examples/overview.html',
				collapsible: true,
				children: getPagesFromSubfolder(path.resolve(__dirname, '../examples')),
			},
			{
				text: 'Case Studies',
				link: '/case-studies/overview.html',
				collapsible: true,
				children: [
					...getPagesFromSubfolder(path.resolve(__dirname, '../case-studies')),
					{
						text: 'Custom Pricing (WooCommerce)',
						link: '/case-studies/wc-custom-pricing/overview.html',
						children: getPagesFromSubfolder(path.resolve(__dirname, '../case-studies/wc-custom-pricing'))
							.filter(page => page.text !== 'Custom Pricing (WooCommerce)')
					}
				]
			},
			{
				text: 'Troubleshooting',
				link: '/troubleshooting.html',
			},
			{
				text: 'Further Resources',
				link: '/resources.html',
			}
		],
	}),
	plugins: [
		registerComponentsPlugin({
			components: {
				Pyramid: path.resolve(__dirname, './components/Pyramid.vue'),
				SectionTOC: path.resolve(__dirname, './components/SectionTOC.vue'),
			}
		}),
		markdownExtPlugin({
			gfm: true,
			footnote: true
		}),
		markdownTabPlugin({
			tabs: true,
		}),
		prismjsPlugin({
			theme: 'coldark-dark',
			preloadLanguages: ['php', 'html', 'css', 'scss', 'js', 'json', 'bash', 'powershell'],
		}),
		searchPlugin(),
		usePagesPlugin({
			startsWith: '/examples/',
			file: 'examples-pages.js'
		}),
		usePagesPlugin({
			startsWith: '/case-studies/',
			file: 'case-studies-pages.js'
		}),
		usePagesPlugin({
			startsWith: '/tooling/',
			file: 'tooling-pages.js'
		}),
		readingTimePlugin({
			// a little lower than average silent reading speed according to https://www.sciencedirect.com/science/article/abs/pii/S0749596X19300786
			// because this is technical information so more likely to be read slower
			wordPerMinute: 150
		}),
	]
});

function getPagesFromSubfolder(folderPath: string) {
	const dirContents = fs.readdirSync(folderPath);
	const files = dirContents
		.filter(file => file.endsWith('.md'))
		.map(file => path.join(folderPath, file));

	files.sort((a, b) => {
		const contentA = fs.readFileSync(a, 'utf-8');
		const contentB = fs.readFileSync(b, 'utf-8');
		const frontmatterA = matter(contentA);
		const frontmatterB = matter(contentB);
		const orderA = frontmatterA.data.order || 0;
		const orderB = frontmatterB.data.order || 0;

		return orderA - orderB;
	});

	return files.map(file => {
		const content = fs.readFileSync(file, 'utf-8');
		const frontmatter = matter(content);
		if(frontmatter.data.status === 'planned') return null;

		const title = frontmatter.data.title || path.basename(file, '.md').replace(/-/g, ' ').replace(/_/g, ' ');

		return {
			text: title,
			link: `/${path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/')}`
		};
	}).filter(Boolean);
}
import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { markdownExtPlugin } from '@vuepress/plugin-markdown-ext';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { searchPlugin } from '@vuepress/plugin-search';
import { usePagesPlugin } from 'vuepress-plugin-use-pages';
import { getDirname, path } from '@vuepress/utils';
import matter from 'gray-matter';

import fs from 'fs';
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
	bundler: viteBundler({
		viteOptions: {
			resolve: {
				alias: {
					'@theme/VPHomeHero.vue': path.resolve(__dirname, 'layouts/HomeHero.vue')
				}
			}
		}
	}),
	lang: 'en-AU',
	title: 'Time for Testing',
	theme: defaultTheme({
		repo: 'doubleedesign/testing-notebook',
		repoLabel: 'GitHub',
		navbar: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'Concepts',
				link: '/concepts/pyramid.html',
			},
			{
				text: 'Examples',
				link: '/examples/overview.html',
			},
			{
				text: 'Case Studies',
				link: '/case-studies/overview.html',
			},
			{
				text: 'About',
				link: '/about.html',
			}
		],
		sidebarDepth: 1,
		sidebar: [
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
				text: 'Examples',
				link: '/examples/overview.html',
				collapsible: true,
				children: getPagesFromSubfolder(path.resolve(__dirname, '../examples')),
			},
			{
				text: 'Case Studies',
				link: '/examples/overview.html',
				collapsible: true,
				children: getPagesFromSubfolder(path.resolve(__dirname, '../case-studies')),
			},
			{
				text: 'Troubleshooting',
				link: '/troubleshooting.html',
			},
			{
				text: 'Further Reading',
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
		const title = frontmatter.data.title || path.basename(file, '.md').replace(/-/g, ' ').replace(/_/g, ' ');

		return {
			text: title,
			link: `/${path.relative(path.resolve(__dirname, '..'), file).replace(/\\/g, '/')}`
		};
	});
}
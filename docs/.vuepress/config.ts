import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { defineUserConfig } from 'vuepress';
import { registerComponentsPlugin } from '@vuepress/plugin-register-components';
import { markdownExtPlugin } from '@vuepress/plugin-markdown-ext';
import { prismjsPlugin } from '@vuepress/plugin-prismjs';
import { searchPlugin } from '@vuepress/plugin-search';
import { getDirname, path } from '@vuepress/utils';
const __dirname = getDirname(import.meta.url);

export default defineUserConfig({
	bundler: viteBundler(),
	lang: 'en-AU',
	title: 'Leesa\'s Testing Notebook',
	theme: defaultTheme({
		repo: 'doubleedesign/testing-notebook',
		repoLabel: 'GitHub',
		navbar: [
			{
				text: 'Home',
				link: '/',
			},
			{
				text: 'About',
				link: '/about.html',
			}
		],
		sidebarDepth: 1,
		sidebar: [
			{
				text: 'Setup',
				link: 'setup.html',
			},
			{
				text: 'Testing Pyramid',
				link: '/',
			},
			{
				text: 'Patterns',
				link: 'patterns.html',
			},
			{
				text: 'Principles',
				link: 'principles.html',
			},
			{
				text: 'Testing Types & Examples',
				link: '/examples/overview.html',
			},
			{
				text: 'Glossary',
				link: '/glossary.html',
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
		searchPlugin() 
	]
});
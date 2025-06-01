<script>
import { usePageData } from '@vuepress/client';
import { usePages as useExamplePages } from '@temp/examples-pages';
import { usePages as useCaseStudyPages } from '@temp/case-studies-pages';

export default {
	name: 'SectionTOC',
	props: {},
	setup() {
		const page = usePageData();

		return {
			page,
			section: page.value.path.split('/')[1] || '', // e.g. examples, case-studies
		};
	},
	data() {
		return {
			pages: {
				'examples': useExamplePages(),
				'case-studies': useCaseStudyPages()
			}
		};
	},
	computed: {
		sectionPages() {
			if (Object.keys(this.pages).length === 0 || !Object.keys(this.pages).includes(this.section) === -1) {
				return [];
			}

			const result = this.sortPages(
				this.pages[this.section].filter(page => {
					return page.frontmatter && page.frontmatter.title !== 'Overview';
				})
			);

			//console.log(result);

			return result;
		}
	},
	methods: {
		sortPages(pages) {
			return pages.sort((a, b) => {
				const orderA = a.frontmatter.order || 999;
				const orderB = b.frontmatter.order || 999;

				return orderA - orderB;
			});
		},
		parseFrontmatterArray(theArray) {
			const asString = theArray.toString().replace('[', '').replace(']', '');
			const result = asString.split(',');

			return result.join(', ');
		}
	}
};
</script>

<template>
	<table class="section-toc">
		<thead>
			<tr>
				<th>Description</th>
				<th>Test type(s)</th>
				<th>Source language</th>
				<th>Tooling</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="page in sectionPages" :key="page.path">
				<td><router-link :to="page.path">{{ page.frontmatter.title }}</router-link></td>
				<td>{{ this.parseFrontmatterArray(page.frontmatter.test_type) }}</td>
				<td>{{ this.parseFrontmatterArray(page.frontmatter.source_lang) }}</td>
				<td>{{ this.parseFrontmatterArray(page.frontmatter.test_tools) }}</td>
			</tr>
		</tbody>
	</table>
</template>


<style scoped lang="scss">
.section-toc {
	tr {
		th, td {
			&:first-of-type {
				width: 40%;
				flex-basis: 40%;
				max-width: 40%;
			}
		}
	}
}
</style>
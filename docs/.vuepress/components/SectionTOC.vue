<script>
import { usePageData } from '@vuepress/client';
import { usePages as useExamplePages } from '@temp/examples-pages';
import { usePages as useCaseStudyPages } from '@temp/case-studies-pages';
import { usePages as useToolingPages } from '@temp/tooling-pages';

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
				'case-studies': useCaseStudyPages(),
				'tooling': useToolingPages()
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
			if(!theArray) return '';
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
				<th>Title</th>
				<th>Test type(s)</th>
				<th>Source language</th>
				<th v-if="section === 'tooling'">Test language</th>
				<th v-else>Tooling</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="page in sectionPages" :key="page.path">
				<td>
					<span v-if="page.frontmatter.status === 'planned'">
						{{ page.frontmatter.title }}
						<Badge type="note" :text="page.frontmatter.status" vertical="middle" />
					</span>
					<span v-else>
						<router-link :to="page.path">
							{{ page.frontmatter.title }}
						</router-link>
						<Badge v-if="page.frontmatter.status" type="info" :text="page.frontmatter.status" vertical="middle" />
					</span>
				</td>
				<td>{{ this.parseFrontmatterArray(page.frontmatter.test_type) }}</td>
				<td v-if="page.frontmatter?.test_lang && (page.frontmatter.source_lang.join() === page.frontmatter.test_lang.join())" colspan="2">
					{{ this.parseFrontmatterArray(page.frontmatter.source_lang) }}
				</td>
				<template v-else>
					<td>{{ this.parseFrontmatterArray(page.frontmatter.source_lang) }}</td>
					<td>{{ this.parseFrontmatterArray(page.frontmatter?.test_lang ?? page.frontmatter.test_tools) }}</td>
				</template>
			</tr>
		</tbody>
	</table>
</template>


<style scoped lang="scss">
.section-toc {
	tr {
		display: grid;
		grid-template-columns: 40% 20% 20% 20%;

		th, td {
			box-sizing: border-box;
			text-indent: revert;

			> span:has(.vp-badge) {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			.vp-badge {
				text-transform: capitalize;
				font-weight: 600;
			}

			&[colspan="2"] {
				grid-column: span 2;
			}
		}
	}
}
</style>
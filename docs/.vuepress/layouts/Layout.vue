<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePageData } from '@vuepress/client';
import { useReadingTimeData, useReadingTimeLocale } from '@vuepress/plugin-reading-time/client';
import Layout from '../../../node_modules/@vuepress/theme-default/lib/client/layouts/Layout.vue';

const route = useRoute();
const page = usePageData();

const readingTimeData = useReadingTimeData();
const readingTimeLocale = useReadingTimeLocale();
let readingData = {};

let isCaseStudy = false;
let isExample = false;
let isToolingStudy = false;
let shouldShowReadingData = true;

// Watch for route changes to ensure data updates
watch(() => route.path, () => {
	// Reset flags
	isCaseStudy = false;
	isExample = false;
	isToolingStudy = false;
	shouldShowReadingData = true;

	readingData = {
		time: readingTimeLocale?.value?.time,
		words: readingTimeData?.value?.words,
	};
	if (route.path.includes('/case-studies/')) {
		isCaseStudy = true;
	}
	if (route.path.includes('/examples/')) {
		isExample = true;
	}
	if (route.path.includes('/tooling/')) {
		isToolingStudy = true;
	}
	if (route.path.endsWith('/overview.html') && route.path.split('/').length < 4) {
		shouldShowReadingData = false;
		isCaseStudy = false;
		isExample = false;
	}
}, { immediate: true });
</script>

<template>
	<Layout>
		<template #page-content-top>
			<div id="before-content" class="vp-page-meta">
				<p v-if="(isExample || isCaseStudy || isToolingStudy)" class="vp-meta-item status">
					Article status:
					<Badge v-if="page.frontmatter.status === 'drafting'" type="info" vertical="middle" :text="page.frontmatter.status" />
					<Badge v-else-if="page.frontmatter.status === 'planned'" type="note" vertical="middle" :text="page.frontmatter.status" />
					<Badge v-else type="tip" vertical="middle" text="Published" />
				</p>
				<div v-if="shouldShowReadingData && readingTimeLocale" class="vp-meta-item reading-time">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.--><path class="fa-secondary" opacity=".4" d="M48 224a176 176 0 1 0 352 0A176 176 0 1 0 48 224zM200 120c0-13.3 10.7-24 24-24s24 10.7 24 24l0 94.1 41 41c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-4.5-4.5-7-10.6-7-17l0-104z"/><path class="fa-primary" d="M400 224A176 176 0 1 0 48 224a176 176 0 1 0 352 0zM224 0C347.7 0 448 100.3 448 224l0 240c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 224C0 100.3 100.3 0 224 0zm0 96c13.3 0 24 10.7 24 24l0 94.1 41 41c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-48-48c-4.5-4.5-7-10.6-7-17l0-104c0-13.3 10.7-24 24-24z"/></svg>
					<p aria-label="Reading time estimate:">
						<span>{{ readingData?.time }} ({{ readingData?.words }} words).</span>
					</p>
				</div>
			</div>
			<h1 v-if="page.frontmatter.heading" class="vp-page-title">
				<span v-if="isCaseStudy">Case study: </span>
				<span v-if="isExample">Example: </span>
				<span v-if="isToolingStudy">Tooling exploration: </span>
				{{ page.frontmatter.heading }}
			</h1>
		</template>
	</Layout>
</template>

<style scoped lang="scss">
.vp-page-meta {
	padding-inline: 0;
	display: flex;
	justify-content: flex-end;
	gap: 1rem;

	.vp-meta-item {
		display: inline-flex;
		gap: 0.25rem;
		align-items: center;
		flex-grow: unset;

		p, &:is(p) {
			font-size: 0.875rem;
			margin: 0;
		}

		svg {
			width: 1em;
		}

		.vp-badge {
			text-transform: capitalize;
			font-weight: 600;
		}
	}
}

.vp-page-title {

	span {
		display: block;
		font-size: 0.65em;
		font-weight: 400;
		letter-spacing: -0.035em;
	}
}
</style>
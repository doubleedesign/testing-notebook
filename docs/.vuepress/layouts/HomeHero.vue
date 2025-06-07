<!--This file is a copy of VPHomeHero.vue, customised to modify how the text is rendered and styled -->
<script setup lang="ts">
import VPAutoLink from '@theme/VPAutoLink.vue';
import type { FunctionalComponent } from 'vue';
import { computed, h } from 'vue';
import { ClientOnly, withBase } from 'vuepress/client';
import { DefaultThemeHomePageFrontmatter } from '@vuepress/theme-default';
import { useDarkMode, useData } from '@vuepress/theme-default/client';

const { frontmatter, siteLocale } = useData<DefaultThemeHomePageFrontmatter>();
const isDarkMode = useDarkMode();

const heroText = computed(() => {
	if (frontmatter.value.heroText === null) {
		return null;
	}

	return frontmatter.value.heroText || siteLocale.value.title || 'Hello';
});
const tagline = computed(() => {
	if (frontmatter.value.tagline === null) {
		return null;
	}

	return (
		frontmatter.value.tagline ||
		siteLocale.value.description ||
		'Welcome to your VuePress site'
	);
});
const heroImage = computed(() => {
	if (isDarkMode.value && frontmatter.value.heroImageDark !== undefined) {
		return frontmatter.value.heroImageDark;
	}

	return frontmatter.value.heroImage;
});
const heroAlt = computed(
	() => frontmatter.value.heroAlt || heroText.value || 'hero',
);
const heroHeight = computed(() => frontmatter.value.heroHeight ?? 280);

const actions = computed(() => {
	if (!Array.isArray(frontmatter.value.actions)) {
		return [];
	}

	return frontmatter.value.actions.map(({ type = 'primary', ...rest }) => ({
		type,
		...rest,
	}));
});

const HomeHeroImage: FunctionalComponent = () => {
	if (!heroImage.value) return null;

	const img = h('img', {
		class: 'vp-hero-image',
		src: withBase(heroImage.value),
		alt: heroAlt.value,
		height: heroHeight.value,
	});

	if (frontmatter.value.heroImageDark === undefined) {
		return img;
	}

	// wrap hero image with <ClientOnly> to avoid ssr-mismatch
	// when using a different hero image in dark mode
	return h(ClientOnly, () => img);
};
</script>

<template>
	<header class="vp-hero">
		<HomeHeroImage />

		<h1 v-if="heroText" id="main-title">
			{{ heroText }}
		</h1>

		<p v-if="tagline" class="vp-hero-description" v-html="tagline"></p>

		<p v-if="actions.length" class="vp-hero-actions">
			<VPAutoLink
				v-for="action in actions"
				:key="action.text"
				class="vp-hero-action-button"
				:class="[action.type]"
				:config="action"
			/>
		</p>
	</header>
</template>

<style lang="scss">
.vp-hero {
	text-align: center;
	display: flex;
	flex-direction: column;
	align-items: center;

	@media (min-width: 1240px) {
		width: fit-content;
	}
}

.vp-hero-image {
	display: block;
	max-width: 100%;
	max-height: 280px;
	margin: 3rem auto 1.5rem;
}

#main-title {
	display: none;
}

.vp-hero-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 1rem;
	justify-content: center;

	@media (min-width: 1240px) {
		width: 100%;
		justify-content: flex-start;
	}
}

.vp-hero-description {
	width: 100%;
	font-family: var(--font-family-highlight);
	color: var(--vp-c-text-mute);
	font-size: 1.6rem;
	line-height: 1.3;
	text-align: center;
	font-weight: 400;

	span {
		font-family: var(--font-family-accent);
		font-size: 1.125em;
	}

	@media (min-width: 1240px) {
		text-align: start;
	}
}

.vp-hero-action-button {
	display: inline-flex;
	align-items: center;
	gap: 0.5rem;
	box-sizing: border-box;
	padding: 0.375rem 1.5rem 0.5rem 1.5rem;
	border: 1px solid var(--vp-c-accent-bg);
	border-radius: 0.25rem;
	background-color: var(--vp-c-bg);
	color: var(--vp-c-accent);
	font-family: var(--font-family-highlight);
	font-weight: 400;
	font-size: 1.2rem;
	transition: all var(--vp-t-color);

	&:after {
		content: '';
		background: currentColor;
		mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z'/%3E%3C/svg%3E");
		width: 1rem;
		height: 1rem;
		display: inline-block;
		transform: rotate(45deg) translateY(0.125rem);
		transition: all var(--vp-t-color);
	}

	&:hover, &:focus {
		background-color: var(--vp-c-accent-hover);
		color: var(--vp-c-accent-text);

		&:after {
			transform: rotate(45deg) translateX(0.25rem) translateY(-0.125rem);
		}
	}

	&.primary {
		background-color: var(--vp-c-accent-bg);
		color: var(--vp-c-accent-text);

		&:hover {
			border-color: var(--vp-c-accent-hover);
			background-color: var(--vp-c-accent-hover);
		}
	}
}
</style>

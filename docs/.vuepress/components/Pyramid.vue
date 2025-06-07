<script lang="ts">
import { defineComponent } from 'vue';
import Popper from 'vue3-popper';
import PyramidSlice from './PyramidSlice.vue';
import PyramidScribble from './PyramidScribble.vue';
import rawContent from './pyramid.json';

export default defineComponent({
	components: {
		PyramidScribble,
		PyramidSlice,
		Popper,
	},
	data() {
		return {
			openItem: null as string | null,
			content: rawContent as Record<string, { title: string; description: string; link?: string }>
		};
	},
	methods: {
		onOpenPopover: function(id: string) {
			this.openItem = id;
		},
		onClosePopover: function() {
			this.openItem = null;
		},
		isItemDimmed: function(id: string) {
			if(!this.openItem) {
				return false;
			}

			return this.openItem !== id;
		},
		formatDescription(text) {
			if (!text) return '';

			return text
				.split(/\n\s*\n/)
				.map(p => p.trim())
				.filter(p => p.length > 0)
				.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
				.join('');
		}
	},
	computed: {
		commonProps() {
			return {
				isDimmed: (id: string) => this.isItemDimmed(id)
			};
		},
		commonEvents() {
			return {
				onOpenPopover: this.onOpenPopover,
				onClosePopover: this.onClosePopover
			};
		}
	}
});
</script>

<template>
	<figure>
		<ol class="slices" aria-label="Testing types">
				<template v-for="(item, key, index) in content" :key="key">
					<li v-if="['unit', 'integration'].includes(key as string)" class="slices__item" >
						<PyramidSlice
							:label="key as string"
							:title="item.title"
							:link="item.link"
							v-on="commonEvents"
							v-bind="commonProps"
						>
							<div v-html="formatDescription(item.description)"></div>
						</PyramidSlice>
					</li>
					<li v-else class="slices__pair">
						<template v-if="key !== 'vr'">
							<PyramidSlice
								:label="key as string"
								:title="item.title"
								:link="item.link"
								v-on="commonEvents"
								v-bind="commonProps"
							>
								<div v-html="formatDescription(item.description)"></div>
							</PyramidSlice>
							<template v-if="key === 'component'">
								<PyramidScribble
									label="Component-level VR"
									:title="content.vr.title"
									:link="content.vr.link"
									:content="content.vr.description"
									v-on="commonEvents"
									v-bind="commonProps"
								>
									<div v-html="formatDescription(content.vr.description)"></div>
								</PyramidScribble>
							</template>
							<template v-if="key === 'e2e'">
								<PyramidScribble
									label="Page-level VR"
									:title="content.vr.title"
									:link="content.vr.link"
									:content="content.vr.description"
									v-on="commonEvents"
									v-bind="commonProps"
								>
									<div v-html="formatDescription(content.vr.description)"></div>
								</PyramidScribble>
							</template>
						</template>
					</li>
				</template>
			</ol>
		<figcaption>The testing pyramid as it relates to CMS-driven websites. <br/>Click a testing type to learn more.</figcaption>
	</figure>
</template>

<style scoped lang="scss">
	figure {
		margin: 0 auto;
		width: 700px;
		height: 600px;
		padding: 1rem;
		box-sizing: border-box;
		container-type: size;
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;

		@media (max-width: 700px) {
			width: 100cqw;
			margin-block-end: 4rem;
		}

		@container (min-width: 700px) and (min-height: 900px) {
			height: 700px;
		}

		figcaption {
			font-size: 0.8rem;
			display: block;
			text-align: center;
			font-style: italic;
			width: 100%;
			flex-basis: 100%;
			padding-block: 0.5rem;
		}
	}

	.slices {
		width: 100%;
		container-type: size;
		padding: 0;
		height: calc(100% - 2rem); // allow for figcaption
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: center;
		gap: 2px;
		position: relative;
		list-style: none;

		&__item {
			width: 100%;
			margin: 0;
		}

		&__pair {
			position: relative;
			width: 100%;
			margin: 0;
		}
	}
</style>
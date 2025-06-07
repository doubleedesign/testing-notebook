<script lang="ts">
import { defineComponent } from 'vue';
import CloseButton from './CloseButton.vue';

export default defineComponent({
	name: 'PopoverContent',
	components: { CloseButton },
	emits: ['close'],
	props: {
		title: {
			type: String
		},
		link: {
			type: String,
			default: '#'
		}
	},
	data() {
		return {
		};
	},
	mounted() {
		(this.$refs.popover as HTMLElement).focus();
		document.addEventListener('keyup', this.handleKeypress);
	},
	beforeUnmount() {
		document.removeEventListener('keyup', this.handleKeypress);
	},
	methods: {
		onClose() {
			this.$emit('close');
		},
		handleKeypress(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				this.onClose();
			}
		},
	}
});
</script>

<template>
	<section class="popover" ref="popover" role="dialog" aria-labelledby="popover-title" aria-modal="true">
		<header class="popover__header">
			<h2 id="popover-title" class="popover__header__title">
				{{ title }}
			</h2>
			<CloseButton @click="onClose" />
		</header>
		<div class="popover__body">
			<slot></slot>
		</div>
		<footer class="popover__footer">
			<router-link :to="link">Read more</router-link>
		</footer>
	</section>
</template>

<style scoped lang="scss">
.popover {

	&__header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		&__title {
			font-size: 1.125rem;
			border: 0;
			margin: 0 !important;
			padding: 0;
		}
	}

	&__body {
		padding-block: 0.5rem;

		:deep p {
			margin-block-start: 0;
			font-weight: 300;
			font-size: 0.875rem;

			&:last-of-type {
				margin-block-end: 0;
			}
		}
	}

	&__footer {
		margin-top: 0.25rem;
		border-top: 1px solid var(--vp-c-text-mute);
		padding-top: 0.25rem;
		display: flex;
		justify-content: flex-end;

		[data-theme="dark"] & {
			border-top-color: color-mix(in srgb, var(--vp-c-text-mute) 95%, black);
		}

		a {
			display: inline-flex;
			gap: 0.5rem;
			align-items: center;
			color: color-mix(in srgb, var(--vp-c-accent) 70%, white);
			font-family: var(--font-family-highlight);
			font-weight: 600;
			letter-spacing: -0.025em;

			[data-theme="dark"] & {
				color: var(--vp-c-accent);
			}

			&:after {
				content: "";
				background: currentColor;
				-webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z'/%3E%3C/svg%3E");
				mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M0 0h24v24H0V0z' fill='none'/%3E%3Cpath d='M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z'/%3E%3C/svg%3E");
				width: 1rem;
				height: 1rem;
				display: inline-block;
				transform: rotate(45deg) translateY(0.125rem);
				transition: all var(--vp-t-color);
			}
		}
	}
}
</style>
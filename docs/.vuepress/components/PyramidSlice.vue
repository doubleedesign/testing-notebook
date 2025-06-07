<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Popper from 'vue3-popper';
import PopoverContent from './PopoverContent.vue';

export default defineComponent({
	name: 'PyramidSlice',
	components: {
		Popper,
		PopoverContent,
	},
	emits: ['onOpenPopover', 'onClosePopover'],
	props: {
		label: {
			type: String,
		},
		title: {
			type: String,
		},
		link: {
			type: String,
			default: '#',
		},
		isDimmed: {
			type: Function as PropType<(id: string) => boolean>,
		}
	},
	data() {
		return {
			id: this.label.replace(/\s+/g, '-').toLowerCase(),
			popperOffset: '-30',
			isOpen: false,
		};
	},
	computed: {
		dimmed() {
			return this.isDimmed(this.id);
		}
	},
	mounted() {
		this.popperOffset = `-${(this.calculateHeight() / 2) - 32}`;
	},
	methods: {
		calculateHeight: function() {
			const slice = this.$el.querySelector('.slice__button');

			return slice.getBoundingClientRect().height;
		},
		onOpen: function() {
			this.isOpen = true;
			this.$emit('onOpenPopover', this.id);
		},
		onClose: function() {
			this.isOpen = false;
			this.$emit('onClosePopover');
		},
		onToggle: function() {
			this.isOpen = !this.isOpen;
			if (this.isOpen) {
				this.onOpen(this.id);
			}
			else {
				this.onClose();
			}
		},
	},
});
</script>

<template>
	<Popper :class="['slice', 'slice--with-popper', { 'slice--dimmed': this.dimmed }]"
			:offsetDistance="this.popperOffset"
			:show="this.isOpen"
			arrow
			disableClickAway
	>
		<button @click="this.onToggle" :class="`slice__button slice__button--${id}`">
			<span>{{ label }}</span>
		</button>
		<template #content>
			<PopoverContent
				:title="title"
				:link="link"
				class="slice__content"
				@close="this.onClose"
			>
				<slot></slot>
			</PopoverContent>
		</template>
	</Popper>
</template>

<style scoped lang="scss">
.slice {
	width: 100%;
	position: relative;
	transition: opacity 0.3s ease-in-out;

	&--dimmed {
		opacity: 0.3;
		pointer-events: none;
	}

	&__button {
		box-sizing: border-box;
		padding: 1rem;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 0;
		appearance: none;
		cursor: pointer;
		font-size: 1rem;
		position: relative;
		font-family: var(--font-family-accent);
		transition: all 0.3s ease;
		text-decoration: underline;
		text-decoration-color: transparent;

		span {
			position: relative;
			display: inline-block;
			font-size: 1.125rem;
			font-weight: 500;
		}

		&:hover, &:focus, &:active {
			text-decoration-color: currentColor;
			text-decoration-thickness: 0.75px;
		}

		&--e2e {
			background: var(--section-color-e2e);
			height: 30cqh;
			clip-path: polygon(
					50% 0,
					50% 0,
					38% 100%,
					62% 100%
			);

			span {
				top: 0.5rem;
			}

			&:hover, &:focus, &:active {
				background: color-mix(in srgb, var(--section-color-e2e) 85%, black)
			}
		}

		&--integration {
			background: var(--section-color-integration);
			height: 15cqh;
			clip-path: polygon(
					38% 0,
					62% 0,
					67.5% 100%,
					32.5% 100%
			);

			span {
				top: 0.25rem;
			}

			&:hover, &:focus, &:active {
				background: color-mix(in srgb, var(--section-color-integration) 85%, black)
			}
		}

		&--component {
			background: var(--section-color-component);
			height: 22cqh;
			clip-path: polygon(
					32.5% 0,
					67.5% 0,
					76% 100%,
					24% 100%
			);

			&:hover, &:focus, &:active {
				background: color-mix(in srgb, var(--section-color-component) 85%, black)
			}
		}

		&--unit {
			background: var(--section-color-unit);
			height: 33cqh;
			clip-path: polygon(
					24% 0,
					76% 0,
					90% 100%,
					10% 100%
			);

			span {
				top: 0.25rem;
			}

			&:hover, &:focus, &:active {
				background: color-mix(in srgb, var(--section-color-unit) 85%, black)
			}
		}
	}

	&__content {
		width: 300px;
	}
}
</style>
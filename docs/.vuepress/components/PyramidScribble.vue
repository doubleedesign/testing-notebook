<script lang="ts">
import { defineComponent, PropType } from 'vue';
import Popper from 'vue3-popper';
import PopoverContent from './PopoverContent.vue';
import { analytics } from '../analytics';

export default defineComponent({
	name: 'PyramidScribble',
	components: {
		Popper,
		PopoverContent
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
		content: {
			type: String
		},
		isDimmed: {
			type: Function as PropType<(id: string) => boolean>,
		}
	},
	data() {
		return {
			id: this.label.replace(/\s+/g, '-').toLowerCase(),
			isOpen: false,
		};
	},
	computed: {
		dimmed() {
			return this?.isDimmed(this.id) ?? false;
		}
	},
	methods: {
		onOpen: function() {
			this.isOpen = true;
			this.$emit('onOpenPopover', this.id);
			analytics.fireEvent('Pyramid popover opened', {
				title: this.title,
				source: this.label,
			});
		},
		onClose: function() {
			this.isOpen = false;
			this.$emit('onClosePopover');
		},
		onToggle: function() {
			this.isOpen = !this.isOpen;
			if (this.isOpen) {
				this.onOpen();
			}
			else {
				this.onClose();
			}
		},
	}
});
</script>

<template>
	<Popper :class="['scribble', `scribble--${id}`, { 'scribble--dimmed' : dimmed }]"
			:show="isOpen"
			arrow
			disableClickAway
	>
		<button @click="this.onOpen"
				:class="`scribble__button scribble__button--${id}`"
		>
			<span>{{ label }}</span>
			<svg role="presentation" xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'>
				<path d='M 10 60 A 50 50 0 0 1 110 60'/>
			</svg>
		</button>
		<template #content>
			<PopoverContent
				:title="title"
				:link="link"
				class="scribble__content"
				@close="this.onClose"
			>
				<slot></slot>
			</PopoverContent>
		</template>
	</Popper>
</template>

<style scoped lang="scss">

.scribble {
	position: absolute;
	z-index: 100;
	transition: opacity 0.3s ease-in-out;

	&--dimmed {
		pointer-events: none;
		opacity: 0.3;
	}

	&--component-level-vr {
		right: -16%;
		bottom: 35%;

		@container (min-width: 440px) {
			right: 0;
			bottom: 40%;
		}
	}

	&--page-level-vr {
		left: 0;
		bottom: 2rem;

		@container (min-width: 440px) {
			left: 16%;
		}
	}

	&__button {
		border: 0;
		appearance: none;
		padding: 0.5rem;
		font-size: 1rem;
		background: transparent;
		color: var(--vp-c-text-mute);
		font-family: var(--font-family-accent);
		cursor: pointer;
		text-wrap: nowrap;

		@container (min-width: 440px) {
			font-size: 1.125rem;
		}

		span {
			display: inline-block;
			transition: 0.3s ease;
			transform-origin: center center;
		}

		svg {
			position: absolute;
			width: 120px;
			height: 60px;

			path {
				transform-origin: center center;
				stroke: var(--vp-c-text-mute);
				stroke-width: 1;
				fill: none;
			}
		}

		&--page-level-vr {
			transform: translateX(-15%);

			svg {
				left: 50%;
				top: 100%;
				clip-path: polygon(
					0 0,
					60% 0,
					100% 100%,
					0 100%
				);
				transform: translateY(-0.25rem);

				path {
					transform: rotate(180deg) scaleX(1.2);
				}
			}

			&:hover, &:focus, &:active {
				span {
					transform: scale(1.1);
				}
			}
		}

		&--component-level-vr {
			svg {
				bottom: 65%;
				left: -20%;
				clip-path: polygon(-1.52% -1px, 100% 0px, 100% 96%, -94px 28.45%);
				transform: translateX(-1rem) translateY(-1rem) rotate(15deg);

				path {
					transform: scaleX(1.2);
				}
			}
		}

		&:hover, &:focus, &:active {
			span {
				color: var(--vp-c-text);
				transform: scale(1.1);
			}
		}
	}

	&__content {
		width: 300px;
	}
}
</style>
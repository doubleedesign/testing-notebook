<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
	name: 'CloseButton',
	methods: {
		onClick() {
			this.$emit('click');
		}
	}
});
</script>

<template>
	<button class="close-button" @click="onClick">
		<svg class="close-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
			<!--!Font Awesome Pro 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2025 Fonticons, Inc.-->
			<path d="M324.5 411.1c6.2 6.2 16.4 6.2 22.6 0s6.2-16.4 0-22.6L214.6 256 347.1 123.5c6.2-6.2 6.2-16.4 0-22.6s-16.4-6.2-22.6 0L192 233.4 59.6 100.9c-6.2-6.2-16.4-6.2-22.6 0s-6.2 16.4 0 22.6L169.4 256 36.9 388.5c-6.2 6.2-6.2 16.4 0 22.6s16.4 6.2 22.6 0L192 278.6 324.5 411.1z"/>
		</svg>
	</button>
</template>

<style scoped lang="scss">
.close-button {
	background: transparent;
	border: 0;
	appearance: none;
	cursor: pointer;
	padding: 0;

	&__icon {
		width: 1.5rem;
		height: 1.5rem;
		fill: var(--popper-theme-text-color);
	}
}
</style>
import { defineClientConfig } from '@vuepress/client';
import { analytics } from './analytics';

export default defineClientConfig({
	enhance({ app, router }) {
		if(typeof window === 'undefined') return;
        
		/**
         * Plausible Analytics events on native VuePress components
         * (custom Vue components in ./vuepress/components/ have the events in their own methods)
         */
		document.addEventListener('click', (event) => {
			// Homepage CTA buttons
			if((event.target as HTMLElement).closest('.vp-hero-actions')) {
				analytics.fireEvent('Homepage button link clicked', {
					label: (event.target as HTMLElement).textContent?.trim(),
					href: (event.target as HTMLAnchorElement).getAttribute('href')
				});
			}

			// Top navigation links
			if((event.target as HTMLElement).closest('.vp-navbar-item')) {
				analytics.fireEvent('Top nav link clicked', {
					label: (event.target as HTMLElement).textContent?.trim(),
					href: (event.target as HTMLAnchorElement).getAttribute('href')
				});
			}

			// Sidebar navigation links
			if((event.target as HTMLElement).closest('.vp-sidebar-item')) {
				let item = (event.target as HTMLElement);

				// Click event was on the arrow
				if((event.target as HTMLElement).classList.contains('arrow')) {
					// Navigate up to the parent item
					item = (event.target as HTMLElement).closest('.vp-sidebar-item') as HTMLAnchorElement;
				}
				// Collapsible item
				if(item.classList.contains('collapsible')) {
					const childList = item.nextElementSibling as HTMLElement;
					setTimeout(() => {
						const closed = childList?.style?.display === 'none';
						analytics.fireEvent(`Sidebar nav section ${closed ? 'collapsed' : 'expanded'}`, {
							label: item.textContent?.trim(),
						});
					}, 300); // timeout waits for the height transition to finish
				}
				// Non-collapsible item
				else {
					analytics.fireEvent('Sidebar nav link clicked', {
						label: item.textContent?.trim(),
						href: item.getAttribute('href')
					});
				}
			}

			// Details panels
			if((event.target as HTMLElement).tagName === 'SUMMARY') {
				const opened = !(event.target as HTMLElement).parentElement?.hasAttribute('open');
				const panelTitle = (event.target as HTMLElement).textContent?.trim();
				analytics.fireEvent(`Details panel ${opened ?  'opened' : 'closed'}`, {
					title: panelTitle,
				});
			}

			// Page nav (prev/next) links
			if((event.target as HTMLElement).closest('.vp-page-nav')) {
				let anchor = event.target as HTMLElement;
				if((event.target as HTMLElement).tagName !== 'A') {
					anchor = (event.target as HTMLElement).closest('a') as HTMLAnchorElement;
				}

				const isPrev = anchor.classList.contains('prev');
				const isNext = anchor.classList.contains('next');
				const action = isPrev ? 'prev' : (isNext ? 'next' : 'unknown');

				analytics.fireEvent('Page nav link clicked', {
					label: anchor.getAttribute('aria-label'),
					action,
					href: anchor.getAttribute('href')
				});
			}
		});

		document.addEventListener('mousedown', (event) => {
			// Search results
			if((event.target as HTMLElement).closest('.search-box')) {
				// @ts-expect-error Vue: Property value does not exist on type Element
				const searchTerm = (event.target as HTMLElement).closest('.search-box').querySelector('input[type=search]')?.value.trim();
				analytics.fireEvent('Search result clicked', {
					title: (event.target as HTMLElement).textContent?.trim(),
					href: (event.target as HTMLElement).closest('a').getAttribute('href'),
					searchTerm
				});
			}
		});

	}
});


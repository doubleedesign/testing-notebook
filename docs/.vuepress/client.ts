import { defineClientConfig } from '@vuepress/client';

export default defineClientConfig({
	enhance({ app, router }) {
		if (typeof window !== 'undefined') {
			document.addEventListener('click', (event) => {

				// Details panel toggles
				if((event.target as HTMLElement).tagName === 'SUMMARY') {
					const opened = !(event.target as HTMLElement).parentElement?.hasAttribute('open');
					const panelTitle = (event.target as HTMLElement).textContent?.trim() || 'No title';
					// @ts-ignore
					window.plausible('Details panel toggled', {
						props: {
							action: opened ? 'opened' : 'closed',
							title: panelTitle,
							page: window.location.pathname
						}
					});
				}

				// Button clicks
				if((event.target as HTMLElement).tagName === 'BUTTON') {
					const buttonText = (event.target as HTMLElement).textContent?.trim() || 'No text';
					console.log(buttonText);
					// @ts-ignore
					window.plausible('Button clicked', {
						props: {
							text: buttonText,
							page: window.location.pathname
						}
					});
				}

				// Link clicks
				if((event.target as HTMLElement).tagName === 'A') {
					const linkText = (event.target as HTMLElement).textContent?.trim() || 'No text';
					// @ts-ignore
					window.plausible('Link clicked', {
						props: {
							text: linkText,
							href: (event.target as HTMLAnchorElement).href,
							page: window.location.pathname
						}
					});
				}
			});
		}
	}
});
export const analytics = {
	fireEvent: (label: string, data: Record<string, string>) => {
		const props = {
			...data,
			sourcePage: window.location.pathname
		};

		if(window.location.hostname === 'localhost') {
			console.debug('Analytics event:', label, { props });
		}

		// @ts-expect-error Vue: Property plausible does not exist on type Window & typeof globalThis
		window.plausible(label, { props });
	}
};
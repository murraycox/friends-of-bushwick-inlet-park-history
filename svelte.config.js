import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({ 
			fallback: '404.html', //undefined
			pages: 'build',
			assets: 'build',
			precompress: false,
			strict: true
		}),
		paths: {
			//base: process.argv.includes('dev') ? '' : '/build' //: process.env.BASE_PATH
            base: process.env.NODE_ENV === 'production' ? process.env.BASE_PATH : ''
		},
		prerender: {
			handleMissingId: ({ id, message }) => {
				// Links like /#/view/pre-1600s target the client-side hash router on the root
				// page (see +page.svelte), not a real in-page anchor, so no matching element
				// id will ever exist. Anything else is a genuinely missing anchor.
				if (id.startsWith('/view/')) return;
				throw new Error(message);
			}
		}
	}
};

export default config;

// import adapter from '@sveltejs/adapter-auto';
// import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
// 	// for more information about preprocessors
// 	preprocess: vitePreprocess(),

// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		adapter: adapter()
// 	}
// };

// export default config;

import { error } from '@sveltejs/kit';

import story from '$lib/data/story.json';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {

	error(404, 'Not found');

	if (params.slug in story.eras) {
		return {
			title: 'Hello world!',
			content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
		};
	}

	error(404, 'Not found');
}
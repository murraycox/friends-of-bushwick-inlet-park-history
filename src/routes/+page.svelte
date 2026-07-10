<script lang="ts">
	import { onMount } from 'svelte';

	import { browser } from '$app/environment';
	import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';

	import NavEras from '$lib/components/NavEras.svelte';
	import NavTimeline from '$lib/components/NavTimeline.svelte';
	import MapsMapbox from '$lib/components/MapsMapbox.svelte';

	let { data } = $props();
	const story = data.story;

	function getInitialViewID() {
		if (!browser) {
			console.log(`routes/map:getInitialViewID(): Browser is not available. Using intro.`);

			return 'intro';
		}

		console.log(`routes/map:getInitialViewID(window.location.hash:${window.location.hash})`);

		const match = window.location.hash.match(/^#\/view\/([^/?#]+)/);

		if (match) {
			const viewID = decodeURIComponent(match[1]);

			if (story.views[viewID]) {
				console.log(`routes/map:getInitialViewID():${viewID}`);

				return viewID;
			}

			console.log(`routes/map:getInitialViewID(): Unknown viewID ${viewID}. Using intro.`);
		}

		console.log(`routes/map:getInitialViewID():intro`);

		return 'intro';
	}

	function getInitialEraID(viewID) {
		console.log(`routes/map:getInitialEraID(viewID:${viewID})`);

		const matchingEra = Object.values(story.eras).find((era) => {
			return era.view == viewID;
		});

		if (matchingEra) {
			console.log(`routes/map:getInitialEraID():${matchingEra.id}`);

			return matchingEra.id;
		}

		console.log(`routes/map:getInitialEraID():null`);

		return null;
	}

	let navEras = $state();
	let navTimeline = $state();
	let maps = $state();

	let mapReady = $state(false);

	const initialViewID = getInitialViewID();
	const initialEraID = getInitialEraID(initialViewID);

	let activeViewID = initialViewID;
	let activeView = story.views[activeViewID];

	let activeEraID = initialEraID;
	let activeEra = activeEraID ? story.eras[activeEraID] : null;

	//TO Not used yet
	let activeStopId = null;

	function onMapFeatureMouseOver(event) {
		console.log('routes/map:onFeatureMouseOver(event.detail:' + JSON.stringify(event.detail) + ')');
		navTimeline.onMapFeatureMouseOver(event);
	}

	function onMapFeatureMouseOut(event) {
		console.log(
			'routes/map:onMapFeatureMouseOut(event.detail:' + JSON.stringify(event.detail) + ')'
		);
		navTimeline.onMapFeatureMouseOut(event);
	}

	function onChapterMouseOver(event) {
		console.log('routes/map:onChapterMouseOver(event.detail:' + JSON.stringify(event.detail) + ')');
		maps.onChapterMouseOver(event);
	}

	function onChapterMouseLeave(event) {
		console.log(
			'routes/map:onChapterMouseLeave(event.detail:' + JSON.stringify(event.detail) + ')'
		);
		maps.onChapterMouseLeave(event);
	}

	function onFeatureClick(event) {
		console.log('routes/map:onFeatureClick(event.detail:' + JSON.stringify(event.detail) + ')');
		navTimeline.onMapFeatureClick(event);
	}

	function getViewIDFromURL() {
		console.log(`routes/map:getViewIDFromURL(window.location.hash:${window.location.hash})`);

		const match = window.location.hash.match(/^#\/view\/([^/?#]+)/);

		if (match) {
			const viewID = decodeURIComponent(match[1]);

			console.log(`routes/map:getViewIDFromURL():${viewID}`);

			return viewID;
		}

		console.log(`routes/map:getViewIDFromURL():intro`);

		return 'intro';
	}

	function getEraIDFromViewID(viewID) {
		console.log(`routes/map:getEraIDFromViewID(viewID:${viewID})`);

		const matchingEra = Object.values(story.eras).find((era) => {
			return era.view == viewID;
		});

		if (matchingEra) {
			console.log(`routes/map:getEraIDFromViewID():${matchingEra.id}`);

			return matchingEra.id;
		}

		console.log(`routes/map:getEraIDFromViewID():null`);

		return null;
	}

	function navigateFromURL() {
		const viewID = getViewIDFromURL();

		console.log(`routes/map:navigateFromURL(viewID:${viewID})`);

		if (!story.views[viewID]) {
			console.log(`routes/map:navigateFromURL(): Unknown viewID ${viewID}. Navigating to intro.`);

			onNavigate(
				{
					detail: {
						viewID: 'intro',
						eraID: null
					}
				},
				false
			);

			return;
		}

		onNavigate(
			{
				detail: {
					viewID: viewID,
					eraID: getEraIDFromViewID(viewID)
				}
			},
			false
		);
	}

	function onNavigate(event, pushHistory = true) {
		console.log(`routes/map:onNavigate(event.detail:${JSON.stringify(event.detail)})`);

		activeViewID = event.detail.viewID;
		activeView = story.views[activeViewID];

		activeEraID = event.detail.eraID;
		if (activeEraID) activeEra = story.eras[activeEraID];
		else activeEra = null;

		navEras.navigate(event);

		if (mapReady) {
			maps.onNavigate(event);
		} else {
			console.log(`routes/map:onNavigate(): Map is not ready yet`);
		}

		navTimeline.onNavigate(event);

		// pushState(`/#/era/${event.detail.id}`, {
		// 	view: 'era',
		//     id: event.detail.id
		// });
		if (pushHistory) goto(`#/view/${event.detail.viewID}`, { state: event.detail });
	}

	function onMapReady() {
		console.log(`routes/map:onMapReady()`);

		mapReady = true;

		navigateFromURL();
	}

	// Handle forward/back buttons
	function popState(event) {
		// If a state has been provided, we have a "simulated" page
		// and we update the active page.
		if (event.state) {
			// Simulate the loading of the previous page
			console.log(`routes/:popstate:event.state:${JSON.stringify(event.state)}`);
			console.log(`routes/:popstate:page.state:${JSON.stringify($page.state)}`); //make sure to use the reactive $, i.e. $page
			if (event.state['sveltekit:states']?.viewID) {
				onNavigate({ detail: { ...event.state['sveltekit:states'] } }, false);
				return;
			}
		}

		console.log(`routes/:popstate: Navigating using URL`);

		navigateFromURL();
	}

	onMount(() => {
		console.log(`routes/map:onMount(window.location.hash:${window.location.hash})`);

		function onHashChange() {
			console.log(`routes/map:onHashChange(window.location.hash:${window.location.hash})`);

			if (mapReady) {
				navigateFromURL();
			} else {
				console.log(`routes/map:onHashChange(): Map is not ready yet`);
			}
		}

		window.addEventListener('hashchange', onHashChange);

		return () => {
			window.removeEventListener('hashchange', onHashChange);
		};
	});
</script>

<svelte:window onpopstate={popState} />
<NavEras bind:this={navEras} on:navigate={onNavigate} />
<MapsMapbox
	bind:this={maps}
	{story}
	{initialViewID}
	{initialEraID}
	on:ready={onMapReady}
	on:featureMouseOver={onMapFeatureMouseOver}
	on:featureMouseOut={onMapFeatureMouseOut}
	on:featureClick={onFeatureClick}
/>
<NavTimeline
	bind:this={navTimeline}
	eras={story.eras}
	on:chapterMouseOver={onChapterMouseOver}
	on:chapterMouseLeave={onChapterMouseLeave}
	on:navigate={onNavigate}
/>

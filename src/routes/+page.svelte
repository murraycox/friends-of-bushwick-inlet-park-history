<script>

    import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';

    import NavEras from "$lib/components/NavEras.svelte";
    import NavTimeline from "$lib/components/NavTimeline.svelte";
    import Maps from "$lib/components/Maps.svelte"

    let navTimeline;
    let maps;

    function onMapFeatureMouseOver(event) {
        console.log("routes/map:onFeatureMouseOver(event.detail:" + JSON.stringify(event.detail) + ")");
        navTimeline.onMapFeatureMouseOver(event);
    }

    function onMapFeatureMouseOut(event) {
        console.log("routes/map:onMapFeatureMouseOut(event.detail:" + JSON.stringify(event.detail) + ")");
        navTimeline.onMapFeatureMouseOut(event);
    }

    function onChapterMouseOver(event) {
        console.log("routes/map:onChapterMouseOver(event.detail:" + JSON.stringify(event.detail) + ")"); 
        maps.onChapterMouseOver(event);
    }

    function onChapterMouseLeave(event) {
        console.log("routes/map:onChapterMouseLeave(event.detail:" + JSON.stringify(event.detail) + ")"); 
        maps.onChapterMouseLeave(event);
    }

    function onFeatureClick(event) {
        console.log("routes/map:onFeatureClick(event.detail:" + JSON.stringify(event.detail) + ")"); 
        navTimeline.onMapFeatureClick(event);
    }

    function onEraClick(event) {
        console.log(`routes/map:onEraClick(event.detail:${JSON.stringify(event.detail)})`); 
        maps.onEraClick(event);
        // pushState(`/#/era/${event.detail.id}`, {
		// 	view: 'era',
        //     id: event.detail.id
		// });
        goto(`#/era/${event.detail.id}`, { state: {view: 'era', id: event.detail.id}, noScroll: true });
    }

    // Handle forward/back buttons
    function popState(event) {
        // If a state has been provided, we have a "simulated" page
        // and we update the current page.
        if (event.state) {
            // Simulate the loading of the previous page
            console.log(`routes/:popstate:event.state:${JSON.stringify(event.state)}`);
            console.log(`routes/:popstate:page.state:${JSON.stringify($page.state)}`);//make sure to use the reactive $, i.e. $page
            if ($page.state.view && $page.state.view == "era"){
                maps.onEraClick({detail: {id: $page.state.id}});
            }

        }
    };
    
</script>
<svelte:window on:popstate={popState}/>
<NavEras on:eraClick={onEraClick}/>
<Maps bind:this={maps} on:featureMouseOver={onMapFeatureMouseOver} on:featureMouseOut={onMapFeatureMouseOut} on:featureClick={onFeatureClick}/>    
<NavTimeline bind:this={navTimeline} on:chapterMouseOver={onChapterMouseOver} on:chapterMouseLeave={onChapterMouseLeave} on:eraClick={onEraClick}/>

<script>

    import { goto, pushState } from '$app/navigation';
	import { page } from '$app/stores';

    import NavEras from "$lib/components/NavEras.svelte";
    import NavTimeline from "$lib/components/NavTimeline.svelte";
    import MapsD3 from "$lib/components/MapsD3.svelte"

    import story from '$lib/data/story.json';

    let navEras = $state();
    let navTimeline = $state();
    let maps = $state();

    let activeViewID = "intro";
    let activeView = story.views[activeViewID];

    let activeEraID = null;
    let activeEra = null;

    //TO Not used yet
    let activeStopId = null;
    
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

    function onNavigate(event, pushHistory = true) {
        console.log(`routes/map:onNavigate(event.detail:${JSON.stringify(event.detail)})`); 

        activeViewID = event.detail.viewID;
        activeView = story.views[activeViewID];
        
        activeEraID = event.detail.eraID;
        if (activeEraID)
            activeEra = story.eras[activeEraID];
        else    
            activeEra = null;

        navEras.navigate(event);
        maps.onNavigate(event);
        navTimeline.onNavigate(event);
        // pushState(`/#/era/${event.detail.id}`, {
		// 	view: 'era',
        //     id: event.detail.id
		// });
        if (pushHistory)
        goto(`#/view/${event.detail.viewID}`, { state: event.detail});
    }

    // Handle forward/back buttons
    function popState(event) {
        // If a state has been provided, we have a "simulated" page
        // and we update the active page.
        if (event.state) {
            // Simulate the loading of the previous page
            console.log(`routes/:popstate:event.state:${JSON.stringify(event.state)}`);
            console.log(`routes/:popstate:page.state:${JSON.stringify($page.state)}`);//make sure to use the reactive $, i.e. $page
            if (event.state["sveltekit:states"].viewID){
                onNavigate({detail: {...event.state["sveltekit:states"]}}, false);
            }

        }
    };
    
</script>
<svelte:window onpopstate={popState}/>
<NavEras 
    bind:this={navEras}
    on:navigate={onNavigate}
/>
<MapsD3 
    bind:this={maps} 
    {story} 
    on:featureMouseOver={onMapFeatureMouseOver} 
    on:featureMouseOut={onMapFeatureMouseOut} 
    on:featureClick={onFeatureClick}
/>    
<NavTimeline 
    bind:this={navTimeline} 
    eras={story.eras} 
    on:chapterMouseOver={onChapterMouseOver} 
    on:chapterMouseLeave={onChapterMouseLeave} 
    on:navigate={onNavigate}/>

<script>

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
    }
    
</script>

<NavEras />
<Maps bind:this={maps} on:featureMouseOver={onMapFeatureMouseOver} on:featureMouseOut={onMapFeatureMouseOut} on:featureClick={onFeatureClick}/>    
<NavTimeline bind:this={navTimeline} on:chapterMouseOver={onChapterMouseOver} on:chapterMouseLeave={onChapterMouseLeave} on:eraClick={onEraClick}/>

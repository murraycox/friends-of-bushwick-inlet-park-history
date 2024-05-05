<script>

    import NavEras from "$lib/components/NavEras.svelte";
    import NavTimeline from "$lib/components/NavTimeline.svelte";
    import Maps from "$lib/components/Maps.svelte"

    let navTimeline;

    function onMapFeatureMouseOver(event) {
        console.log("routes/map:onFeatureMouseOver(event.detail:" + JSON.stringify(event.detail) + ")");
        navTimeline.onMapFeatureMouseOver(event);
    }
    
</script>

<NavEras />
<Maps on:featureMouseOver={onMapFeatureMouseOver}/>    
<NavTimeline bind:this={navTimeline} />

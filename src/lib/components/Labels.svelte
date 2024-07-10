<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoPath } from  "d3";
    import { base } from '$app/paths';

    export let path;
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let interactive = false; //whether to track mouse events like mouseenter, mouseout and mousemove
    export let visible = false;
    export let filterOnContext = false;
    export let activeViewID;
    export let activeEraID;
    export let activeStopID;
    export let labelField = "label";

    export function onChapterMouseOver(event){
        console.log("Map(id: " + id + "):onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        highlightedChapterID = event.detail.id;
    }

    export function onChapterMouseLeave(event){
        console.log("Map(id: " + id + "):onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");
        highlightedChapterID = null;
    }

    let dataset = [];
    let highlightedChapterID = null;

    const dispatch = createEventDispatcher();

    onMount(() => {
        console.log(`Labels:onMount(id:${id})`);
        json(base + path).then((geoJsonData) => {

            dataset = geoJsonData.features;
            path = geoPath()
                .projection(projection);

        });
    });

    //we pass the feature in as the parameter. Tried to instead use event or this, but this seem to work the best.
    function onFeatureMouseOver(feature) {
        
        console.log("Map:onFeatureMouseOver(feature:" + JSON.stringify(feature) + ")");
        if (feature.properties && feature.properties.chapter)
            console.log("Map:onFeatureMouseOver(section:" + JSON.stringify(feature.properties.chapter) + ")");

        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureMouseOver', {
			mapID: id,
            featureID: (feature.properties && feature.properties.chapter)? feature.properties.chapter : '?'
		});
        // d3.selectAll("path")
        //     .classed("hover", false);
        // if (d.properties && d.properties.section) { //do we want to call this section, or chapter??
        //     d3.select(this)
        //         .classed("hover", true);
        //     tooltip.select("#tooltip-lot-name").html(d.properties["section"]);
        //     tooltip.style("visibility", "visible");
        // };
    }

    // function featureMouseMove(e, d){

    //     if (d.properties && d.properties.section) { //do we want to call this section, or chapter??
    //         tooltip.style("top", (e.pageY+5)+"px").style("left",(e.pageX+5)+"px");
    //     }

    // }

    function onFeatureMouseOut(feature){
 
        console.log("Map:onFeatureMouseOut(feature:" + JSON.stringify(feature) + ")");
        if (feature.properties && feature.properties.chapter)
            console.log("Map:onFeatureMouseOut(id:" + JSON.stringify(feature.properties.chapter) + ")");

        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureMouseOut', {
			mapID: id,
            featureID: (feature.properties && feature.properties.chapter)? feature.properties.chapter : '?'
		});

    }

    function onFeatureClick(feature){
        console.log("Map:onFeatureClick(feature:" + JSON.stringify(feature) + ")");
        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureClick', {
			mapID: id,
            featureID: (feature.properties && feature.properties.chapter)? feature.properties.chapter : '?'
		});
    }

</script>

<g class="map-svg-g {`view-${activeViewID}`} {`era-${activeEraID}`} {`stop-${activeStopID}`}" class:visible={visible} class:hidden={!visible} id={id} class:interactive={interactive}>
{#each dataset as data}
    <!-- some geometries in the shapefile are none? -->
    {#if (data.geometry && (!filterOnContext || data.properties.era == activeEraID))}
        <text
            class="text-background"
            transform={`translate(${projection(data.geometry.coordinates)})`}
            dy=".35em"
        >
            {data.properties[labelField]}
        </text>
        {#if interactive}        
            <text
                transform={`translate(${projection(data.geometry.coordinates)})`}
                dy=".35em"
                class:hover={interactive && data.properties && data.properties.chapter && highlightedChapterID==data.properties.chapter}
                on:mouseover={onFeatureMouseOver(data)} 
                on:mouseout={onFeatureMouseOut(data)} 
                on:click={onFeatureClick(data)}
            >
                {data.properties[labelField]}
            </text>

        {:else}
            <text
                transform={`translate(${projection(data.geometry.coordinates)})`}
                dy=".35em"
            >
                {data.properties[labelField]}
            </text>
        {/if}
    {/if}
{/each}
</g>


<style>

    .map-svg-g.visible text{
        visibility: visible;
        opacity: 1;
        transition: opacity 4s linear;
    }

    .map-svg-g.hidden text {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 4s, opacity 4s linear;
    }

    .map-svg-g.interactive text {
        cursor: pointer;
    }

    .map-svg-g.interactive text:hover, .map-svg-g.interactive text.hover {
        font-weight: 900 !important;
    }

    text {
        fill: #343434;
        fill-opacity: .8;
        /* font-size: 8px; */
        font-weight: 500;
        text-anchor: middle;
    }

    /* We might be able to build scaling the stroke-width into the map zoom, but for now we will use styles */
    /* .stop-when-it-is-completed and 50-kent-st */
    #fbip-labels.stop-when-it-is-completed text,
    #fbip-labels.stop-50-kent-st text
    {
        /* font-size: 2px; */
    }

    #fbip-labels.era-pre-1600s text
    {
        /* font-size: 6px; */
    }

    #era-1-labels text.text-background
    {
        fill: white; /* TODO convert this to a variable */
        /* font-size: 24px; */
        font-weight: 700;

    }

    #era-1-labels text
    {
        fill: #5199C7; /* TODO convert this to a variable */
        /* font-size: 22px; */
        font-weight: 700;

    }

</style>
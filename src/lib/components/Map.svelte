<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";
    import * as topojson from "topojson-client";

    import { base } from '$app/paths';

    export let url = "";
    export let topoJson = false;
    export let topoJsonObjectsName = "";
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let interactive = false; //whether to track mouse events like mouseenter, mouseout and mousemove
    export let visible = false;
    export let geometryType = "polygons";
    export let activeViewID;
    export let activeEraID;
    export let activeStopID;

    export function onChapterMouseOver(event){
        console.log("Map(id: " + id + "):onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        highlightedChapterID = event.detail.id;
    }

    export function onChapterMouseLeave(event){
        console.log("Map(id: " + id + "):onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");
        highlightedChapterID = null;
    }

    let dataset = [];
    let path = null;
    let highlightedChapterID = null;

    const dispatch = createEventDispatcher();

    onMount(() => {
        json(base + url).then((geoJsonData) => {

            dataset = !topoJson ? 
                geoJsonData.features
				:
				topojson.feature(
					geoJsonData,
					geoJsonData.objects[topoJsonObjectsName]
				).features;


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
<g class="map-svg-g {`view-${activeViewID}`} {`era-${activeEraID}`} {`stop-${activeStopID}`}" class:visible={visible} class:hidden={!visible} class:interactive={interactive} id={id}>
    <pattern id="circles-urban-industrial-era" x=0 y=0 width=2 height=2 patternUnits="userSpaceOnUse">
        <circle cx=1 cy=1 r=0.6 fill=#A060C1></circle>
    </pattern>
    <pattern id="circles-pre-1600s" x=0 y=0 width=10 height=10 patternUnits="userSpaceOnUse">
        <circle cx=5 cy=5 r=2 fill=#83BC6E></circle>
    </pattern>
    <pattern id="circles-intro" x=0 y=0 width=1 height=1 patternUnits="userSpaceOnUse">
        <circle cx=0.5 cy=0.5 r=0.4 fill=#83BC6E></circle>
    </pattern>

{#each dataset as data}
    {#if geometryType == 'polygons'}
        {#if interactive}
            {data.properties.chapter}
            {highlightedChapterID}
            <path class="{`feature-${data.properties.id}`}" d={path(data)} class:hover={interactive && data.properties && data.properties.chapter && (highlightedChapterID==data.properties.chapter)} on:mouseover={onFeatureMouseOver(data)} on:mouseout={onFeatureMouseOut(data)} on:click={onFeatureClick(data)}/>
        {:else}
            <path class="{`feature-${data.properties.id}`}" d={path(data)}/>
        {/if}
    {:else}
        <circle
            class="{`feature-${data.properties.id}`}"
            cx={projection(data)[0]}
            cy={projection(data)[1]}
            r=30
            fill="#599FF0"
        />
    {/if}
{/each}
</g>


<style>

    .map-svg-g.visible path{
        visibility: visible;
        opacity: 1;
        /* transition: opacity 4s linear; */
    }

    .map-svg-g.hidden path {
        visibility: hidden;
        opacity: 0;
        /* transition: visibility 0s 4s, opacity 4s linear; */
    }
    
    #nyc-landline path{
        stroke: #cbcaca;
        stroke-width: 1;
        fill: #fcfcfc;
    }

    #bip-lots path {
        stroke: #A060C1;
        stroke-dasharray: 0.2 0.2;
        stroke-width: 1;
        fill: url(#circles-urban-industrial-era);
        fill-opacity: 0.5;
    }

    #bip-lots.view-intro path {
        stroke: #83BC6E;
        fill: url(#circles-intro);
    }

    #bip-lots.map-svg-g.visible path {
        opacity: 0.75;
        /* transition: opacity 4s linear; */
    }

    #era3-story-polygons path {
        stroke: #A060C1;
        stroke-dasharray: 0.2 0.2;
        stroke-width: 0.5;
        fill: url(#circles-urban-industrial-era);
        fill-opacity: 0.5;
        cursor: pointer;
    }

    #era3-story-polygons.map-svg-g.visible path {
        opacity: 0.75;
        /* transition: opacity 4s linear; */
    }

    #era3-story-polygons path:hover, #era3-story-polygons path.hover{
        fill-opacity: 1;
    }

    #oyster-historic-beds{
        stroke: #599FF0;
        stroke-width: 5;
        fill: url(#circles-pre-1600s);
        fill-opacity: 0.5;
    }

    #era-1-polys path {
        stroke: #83BC6E;
        stroke-width: 2;
        fill: url(#circles-pre-1600s);
        fill-opacity: 0.5;
        cursor: pointer;
    }

    #era-1-polys path:hover, #era-1-polys path.hover {
        stroke: blue;
    }

    #oyster-restoration-sites {
        fill: #599FF0;
    }

    #seventeenseventysix-shoreline path{
    stroke: darkblue;
    fill: none;
    /* stroke-width: 0.25; */
    /* fill: url(#circles); */
    }

    #seventeenseventysix-shoreline.map-svg-g.visible path {
        opacity: 0.2;
        /* transition: opacity 4s linear; */
    }

    #nyc-historical-waterline{
        fill: #378ed5; 
    }

    #nyc-historical-waterline.map-svg-g.visible path {
        opacity: 0.17;
        /* transition: opacity 4s linear; */
    }

    #indian-paths-kings-county path{
        stroke: brown;
        stroke-width: 2;
        stroke-dasharray: 4 4;
        fill: none;
    }

    #era-1-lines-the-strand path{
        stroke: blue;
        stroke-width: 3;
        stroke-dasharray: 4 4;
        fill: none;
    }

    #indian-paths-nyc path{
        stroke: blue;
        fill: none;
    }

    /* We might be able to build scaling the stroke-width into the map zoom, but for now we will use styles */
    /* .stop-when-it-is-completed and stop-50-kent-st */
    /* .era-urban-industrial-era */
    #nyc-landline.stop-when-it-is-completed path, #historical-waterline.stop-when-it-is-completed path, #seventeenseventysix-shoreline.stop-when-it-is-completed path, #bip-lots.stop-when-it-is-completed path,
    #nyc-landline.stop-50-kent-st path, #historical-waterline.stop-50-kent-st path, #seventeenseventysix-shoreline.stop-50-kent-st path, #bip-lots.stop-50-kent-st path,
    #nyc-landline.era-urban-industrial-era path, #historical-waterline.era-urban-industrial-era path, #seventeenseventysix-shoreline.era-urban-industrial-era path {

        stroke-width: 0.3;
    }

    #bip-lots.stop-50-kent-st path.feature-50-kent-st {
        fill-opacity: 0.9;
    }


</style>
<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";

    export let url = "";
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let enableHover = false; //whether to track mouse events like mouseenter, mouseout and mousemove

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
        json(url).then((geoJsonData) => {

            dataset = geoJsonData.features;
            path = geoPath()
                .projection(projection);

        });
    });

    //we pass the feature in as the parameter. Tried to instead use event or this, but this seem to work the best.
    function onFeatureMouseOver(feature) {
        
        console.log("Map:onFeatureMouseOver(feature:" + JSON.stringify(feature) + ")");
        if (feature.properties && feature.properties.id)
            console.log("Map:onFeatureMouseOver(section:" + JSON.stringify(feature.properties.id) + ")");

        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureMouseOver', {
			mapID: id,
            featureID: (feature.properties && feature.properties.id)? feature.properties.id : '?'
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
        if (feature.properties && feature.properties.id)
            console.log("Map:onFeatureMouseOut(id:" + JSON.stringify(feature.properties.id) + ")");

        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureMouseOut', {
			mapID: id,
            featureID: (feature.properties && feature.properties.id)? feature.properties.id : '?'
		});

    }

    function onFeatureClick(feature){
        console.log("Map:onFeatureClick(feature:" + JSON.stringify(feature) + ")");
        // Dispatch the id of the map and the feature id to the parent component
        dispatch('featureClick', {
			mapID: id,
            featureID: (feature.properties && feature.properties.id)? feature.properties.id : '?'
		});
    }


</script>

<g class="map-svg-g" id={id}>
{#each dataset as data}
    {#if enableHover}
        <path d={path(data)} class:hover={data.properties && data.properties.id && highlightedChapterID==data.properties.id} on:mouseover={onFeatureMouseOver(data)} on:mouseout={onFeatureMouseOut(data)} on:click={onFeatureClick(data)}/>
    {:else}
        <path d={path(data)}/>
    {/if}
{/each}
</g>


<style>

    #nyc-landline path{
        stroke: #cbcaca;
        /* stroke-width: 0.25; */
        fill: #fcfcfc;
    }

    #bip-lots path {
    stroke: darkgreen;
    stroke-width: 1;
    /* fill: url(#circles); */
    fill: green;
    cursor: pointer;
    opacity: 0.9;
    }

    #bip-lots path:hover, #bip-lots path.hover{
    fill: darkgreen;
    }

    /* we had to escale the 1 as \31 */
    #seventeenseventysix-shoreline path{
    stroke: darkblue;
    opacity: 0.2;
    fill: none;
    /* stroke-width: 0.25; */
    /* fill: url(#circles); */
    }

    #historical-waterline{
        fill: #378ed5;
        opacity: 0.17;
    }


    #map-era-1-indian-paths-kings-county path{
        stroke: red;
        fill: none;
    }

    #map-era-1-indian-paths-nyc path{
        stroke: green;
        fill: none;
    }

</style>
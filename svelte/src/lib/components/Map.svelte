<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";

    export let url = "";
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let enableHover = false; //whether to track mouse events like mouseenter, mouseout and mousemove

    let dataset = [];
    let path = null;

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


</script>

<g class="map-svg-g" id={id}>
{#each dataset as data}
    {#if enableHover}
        <path d={path(data)} on:mouseover={onFeatureMouseOver(data)} on:mouseout={onFeatureMouseOut(data)}/>
    {:else}
        <path d={path(data)}/>
    {/if}
{/each}
</g>


<style>

#map-nyc-region-land path{
    stroke: #cbcaca;
    /* stroke-width: 0.25; */
    fill: #fcfcfc;
}

#map-era-3-story path {
  stroke: darkgreen;
  stroke-width: 1;
  /* fill: url(#circles); */
  fill: green;
  cursor: pointer;
  opacity: 0.9;
}

#map-era-3-story path:hover{
  fill: darkgreen;
}

#map-era-1-shorelines path{
  stroke: darkblue;
  opacity: 0.2;
  fill: none;
  /* stroke-width: 0.25; */
  /* fill: url(#circles); */
}

</style>
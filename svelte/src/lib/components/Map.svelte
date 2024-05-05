<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";

    export let url = "";
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let enableHover = false;

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

    function onFeatureMouseOver(feature) {
        // console.log("Map:onFeatureMouseOver(event: " + JSON.stringify(event));
        // console.log("Map:onFeatureMouseOver(this:" + JSON.stringify(this));
        // console.log("Map:onFeatureMouseOver(this:" + JSON.stringify(this.properties.section));
        console.log("Map:onFeatureMouseOver(feature:" + JSON.stringify(feature) + ")");
        if (feature.properties && feature.properties.section)
            console.log("Map:onFeatureMouseOver(section:" + JSON.stringify(feature.properties.section) + ")");

        dispatch('featureMouseOver', {
			mapID: id,
            featureID: (feature.properties && feature.properties.section)? feature.properties.section : '?'
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

    function onFeatureMouseOut(event){
        console.log("Map:onFeatureMouseOut:" + event);
        // tooltip.style("visibility", "hidden");

    }


</script>

<g class="map-svg-g" id={id}>
{#each dataset as data}
  <path d={path(data)} on:mouseover={onFeatureMouseOver(data)} on:mouseout={onFeatureMouseOut}/>
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
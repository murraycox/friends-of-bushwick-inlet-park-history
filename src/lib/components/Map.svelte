<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";

    export let url = "";
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let interactive = false; //whether to track mouse events like mouseenter, mouseout and mousemove
    export let visible = false;
    export let geometryType = "polygons";

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

<g class="map-svg-g" class:visible={visible} class:hidden={!visible} id={id}>
    <pattern id="circles-urban-industrial-era" x=0 y=0 width=5 height=5 patternUnits="userSpaceOnUse">
        <circle cx=1 cy=1 r=3 fill=#A060C1></circle>
    </pattern>
    <pattern id="circles-pre-1600s" x=0 y=0 width=50 height=50 patternUnits="userSpaceOnUse">
        <circle cx=50 cy=50 r=20 fill=#599FF0></circle>
    </pattern>

{#each dataset as data}
    {#if geometryType == 'polygons'}
        {#if interactive}
            <path d={path(data)} class:hover={data.properties && data.properties.id && highlightedChapterID==data.properties.id} on:mouseover={onFeatureMouseOver(data)} on:mouseout={onFeatureMouseOut(data)} on:click={onFeatureClick(data)}/>
        {:else}
            <path d={path(data)}/>
        {/if}
    {:else}
        <circle
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
        transition: opacity 4s linear;
    }

    .map-svg-g.hidden path {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 4s, opacity 4s linear;
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
        cursor: pointer;
    }

    #bip-lots.map-svg-g.visible path {
        opacity: 0.75;
        transition: opacity 4s linear;
    }

    #bip-lots path:hover, #bip-lots path.hover{
        fill: url(#circles-urban-industrial-era);
        fill-opacity: 1;
    }

    #oyster-historic-beds{
        stroke: #599FF0;
        stroke-width: 5;
        fill: url(#circles-pre-1600s);
        fill-opacity: 0.5;
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
        transition: opacity 4s linear;
    }

    #historical-waterline{
        fill: #378ed5; 
    }

    #historical-waterline.map-svg-g.visible path {
        opacity: 0.17;
        transition: opacity 4s linear;
    }

    #indian-paths-kings-county path{
        stroke: blue;
        fill: none;
    }

    #indian-paths-nyc path{
        stroke: blue;
        fill: none;
    }

</style>
<script lang="ts">
    
    import { createEventDispatcher } from 'svelte';
    import { geoAlbers, geoMercator, geoPath } from "d3";
    import * as d3 from 'd3';

    import Map from "$lib/components/Map.svelte";
    import TileMap from "$lib/components/TileMap.svelte";

    import story from '$lib/data/story.json';

    export function onChapterMouseOver(event){
        console.log("Maps:onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all of just some maps
        // mapEra3Story.onChapterMouseOver(event);
    };

    export function onChapterMouseLeave(event){
        console.log("Maps:onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all of just some maps
        // mapEra3Story.onChapterMouseLeave(event);
    };

    export function onEraClick(event){
        console.log(`Maps:onEraClick(event:${JSON.stringify(event.detail)})`);
        console.log(`Maps:onEraClick(era.extent:${JSON.stringify(story.eras[event.detail.id].extent)})`)
        //Updating the current view should automatically change the visibility of the maps?
        currentView = event.detail.id;
        if (story.eras[event.detail.id].extent){

            const rectGeoJsonExtent = getGeoJsonRect(story.eras[event.detail.id].extent);
            var path = d3.geoPath()
                .projection(projection);
            const boundsRectExtent = path.bounds(rectGeoJsonExtent);

            const [[x0, y0], [x1, y1]] = boundsRectExtent; //path.bounds(d);
            d3.select(gMap).transition()
                .duration(3000)
                .ease(d3.easeCubicOut)
                .call(
                    zoom.transform,
                    d3.zoomIdentity
                        .translate(mapWidth / 2, mapHeight / 2) // I think this is here so that the transform implements the translate to the middle of the screen, not the top/left?
                        .scale(0.9 / Math.max((x1 - x0) / mapWidth, (y1 - y0) / mapHeight))
                        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
                );
        };
    };

    let mapEra3Story;
    let gMap;

    let mapWidth = 800;
    let mapHeight = 600;

    let zoom;

    let currentView = story.intialView;

    zoom = d3.zoom()
        .on("zoom", zoomed);

    const dispatch = createEventDispatcher();

    function zoomed(event) {
        const {transform} = event;
        d3.select(gMap).attr("transform", transform);
        // gMap.attr("stroke-width", 1 / transform.k);
    }

    function getGeoJsonRect(extent: {nwLng, nwLat, seLng, seLat}): any{
        
        //converts an extent object to a geojson representation of a rectangle
        // an extent object is something like:
        // {
        //     nwLng: -74.33736285,
        //     nwLat: 40.95368295,
        //     seLng: -73.62359621,
        //     seLat: 40.47071658
        //  }
        
        const geoJsonRect = {
            "type": "FeatureCollection",
            "features": [
                {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "coordinates":[[[extent.nwLng,extent.nwLat],[extent.seLng,extent.nwLat],[extent.seLng,extent.seLat],[extent.nwLng,extent.seLat],[extent.nwLng,extent.nwLat]]],
                    "type": "Polygon"
                }
                }
            ]
        };
        return geoJsonRect;
    };

    // Need to use Mercator projection when using tiles, or at least I couldn't get the tiles to work with geoAlbers and the examples in the documentaiton
    const projection = geoMercator()
        .rotate([74, 0]) //Rotate the projection
        //TODO get the correct height and width, and respond to resizing
        .fitSize([mapWidth, mapHeight], getGeoJsonRect(story.eras[story.intialView].extent));

    function onFeatureMouseOver(event) {
        console.log("Maps:onFeatureMouseOver(event.detail:" + JSON.stringify(event.detail) + ")");

        // TODO, add info about which map?
        dispatch('featureMouseOver', event.detail);
    }

    function onFeatureMouseOut(event) {
        console.log("Maps:onFeatureMouseOut(event.detail:" + JSON.stringify(event.detail) + ")");

        // TODO, add info about which map?
        dispatch('featureMouseOut', event.detail);
    }

    function onFeatureClick(event) {
        console.log("Maps:onFeatureClick(event.detail:" + JSON.stringify(event.detail) + ")");

        // TODO, add info about which map?
        dispatch('featureClick', event.detail);
    }

    console.log(JSON.stringify())
</script>

<div id="map">
    <svg id="map-svg">
        <g bind:this={gMap}>
            {#each Object.values(story.maps) as map }
                {#if map.type == "shapefile"}
                    {#if map.interactive}
                        <Map bind:this={map.this} url={map.url} id={map.id} projection={projection} visible={(story.eras[currentView].maps && story.eras[currentView].maps.includes(map.id))} interactive={true} on:featureMouseOver={onFeatureMouseOver} on:featureMouseOut={onFeatureMouseOut} on:featureClick={onFeatureClick} />
                    {:else}
                        <Map url={map.url} id={map.id} projection={projection} visible={(story.eras[currentView].maps && story.eras[currentView].maps.includes(map.id))} />
                    {/if}
                {:else if map.type == "tile"}
                    <TileMap urlPath={map.urlPath} urlExtension={map.urlExtension} projection={projection} visible={(story.eras[currentView].maps && story.eras[currentView].maps.includes(map.id))} />
                {/if}
            {/each}
         </g>
    </svg>
</div>


<style>

    #map, #map-svg {
        position: absolute;
        width: 100%;
        height: 100%
    }

</style>
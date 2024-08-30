<script lang="ts">
    
    import { createEventDispatcher, onMount } from 'svelte';

    import { geoAlbers, geoMercator, geoPath } from "d3";
    import * as d3 from 'd3';

    import Map from "$lib/components/Map.svelte";
    import TileMap from "$lib/components/TileMap.svelte";
    import Labels from "$lib/components/Labels.svelte"
    import { onScroll } from "$lib/on-scroll";

    import styles from '$lib/styles.js';

    export let story = {};

    export function onChapterMouseOver(event){
        console.log("Maps:onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all or just some maps
        refs.forEach(ref => {
            if (ref.onChapterMouseOver)
                ref.onChapterMouseOver(event);
        });

    };

    export function onChapterMouseLeave(event){
        console.log("Maps:onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all or just some maps
        refs.forEach(ref => {
            if (ref.onChapterMouseLeave)
                ref.onChapterMouseLeave(event);
        });
    };

    export function onNavigate(event){
        console.log(`Maps:onNavigate(event:${JSON.stringify(event.detail)})`);
        //Updating the current view should automatically change the visibility of the maps?
        //activeView = story.eras[event.detail.id].view;
        activeViewID = event.detail.viewID;
        activeEraID = event.detail.eraID;
        activeStopID = null; //until we move through the story
        if (story.views[activeViewID].extent){
            moveMap(story.views[activeViewID].extent);
        };
    };

    let refs = [];
    let interactiveMap;
    let svgMap;
    let gMap;

    let mapWidth;
    let mapHeight;

    let zoom;

    let activeViewID = story.intialView;
    let activeEraID = null;
    let activeStopID = null;

	let projection;

    let isLoading = true;

    const ZOOM_DURATION = 2500;

    onMount(() => {
        console.log(`Maps:onMount()`);

        mapWidth = parseInt(d3.select(svgMap).style('width'), 10);
        mapHeight = parseInt(d3.select(svgMap).style('height'), 10);
        console.log(`Map width: ${mapWidth}; height: ${mapHeight}`);

        projection = geoMercator()
            .rotate([74, 0]) //Rotate the projection
            //TODO get the correct height and width, and respond to resizing
            .fitSize([mapWidth, mapHeight], getGeoJsonRect(story.views[story.intialView].extent));

        isLoading = false;

    });

    zoom = d3.zoom()
        .on("zoom", zoomed);

    const dispatch = createEventDispatcher();

    function moveMap(extent){
        console.log(`Maps:moveMap(extent:${JSON.stringify(extent)}`);

        mapWidth = parseInt(d3.select("#map-svg").style('width'), 10);
        mapHeight = parseInt(d3.select("#map-svg").style('height'), 10);
        console.log(`Map width: ${mapWidth}; height: ${mapHeight}`);

        const rectGeoJsonExtent = getGeoJsonRect(extent);
        var path = d3.geoPath()
            .projection(projection);
        const boundsRectExtent = path.bounds(rectGeoJsonExtent);

        const [[x0, y0], [x1, y1]] = boundsRectExtent; //path.bounds(d);
        d3.select(gMap).transition()
            .duration(ZOOM_DURATION)
            // .ease(d3.easeCircleInOut)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(mapWidth / 2, mapHeight / 2) // I think this is here so that the transform implements the translate to the middle of the screen, not the top/left?
                    .scale(0.9 / Math.max((x1 - x0) / mapWidth, (y1 - y0) / mapHeight))
                    .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
            );

    };


    function zoomed(event) {
        const {transform} = event;
        d3.select(gMap).attr("transform", transform);
        // TODO have some different sizes for different types of labels?
        // TODO, should we pass this to the Labels layer, which might be a better place for context?
        d3.select(gMap).selectAll("text").attr("font-size", 10 / transform.k);
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

    //console.log(JSON.stringify(story.eras[activeView].maps));
    function onStop(stopId){
        //A "stop" on the narrative
        console.log(`Maps:onStop(stopID:${stopId})`);
        activeStopID = stopId;
        //look up the stop
        if (!stopId){
            moveMap(story.views[activeViewID].extent);
        }
        else if (story.views[activeViewID].stops && story.views[activeViewID].stops[activeStopID]) {
            moveMap(story.views[activeViewID].stops[activeStopID].extent);
        };

    };

</script>

<div id="map" class="{`view-${activeViewID}`} {`era-${activeEraID}`} {`stop-${activeStopID}`}"
    style="--color-era-urban-industrial: {styles.colorEraUrbanIndustrial}; --color-era-pre-1600s: {styles.colorEraPre1600s}; --color-era-early-european-settlement: {styles.colorEraEarlyEuropeanSettlement}"
>
    {#if activeEraID }
        <div id="story-context-container">
            <div id="era-short-label">
                {story.eras[activeEraID].shortLabel}
            </div>
            <div id="era-long-label">
                {story.eras[activeEraID].longLabel} (New Map!!!)
            </div>
        </div>
    {/if}
    {#if story.views[activeViewID].story}
        <div id="story-narrative-container">
            <div id="story-narrative">
                <h1 use:onScroll={onStop}>
                    {story.views[activeViewID].name}
                </h1>
                    {#each story.views[activeViewID].story as storyElement}
                        {#if storyElement.type == "h"}
                            {#if storyElement.stop}
                                <h2 use:onScroll={onStop} data-id={storyElement.stop}>{@html storyElement.text}</h2>
                            {:else}
                                <h2>{@html storyElement.text}</h2>
                            {/if}
                        {:else if storyElement.type == "p"}
                            <p>{@html storyElement.text}</p>
                        {/if}
                    {/each}
            </div>
        </div>
    {/if}
    <svg bind:this={svgMap} id="map-svg" class:story={story.views[activeViewID].story != null}>
        <g bind:this={gMap}>   
            {#if !isLoading }      
                {#each Object.values(story.maps) as map, i }
                    {#if (activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id)) }
                    {#if map.type == "shapefile"}
                        {#if map.interactive}
                            <Map 
                                bind:this={refs[i]}
                                {activeViewID} {activeEraID} {activeStopID}
                                url={map.url} 
                                topoJson={map.topoJson}
                                topoJsonObjectsName={map.topoJsonObjectsName}
                                geometryType={map.geometryType? map.geometryType : 'polygons'} 
                                id={map.id} projection={projection} 
                                visible={(activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id))} 
                                interactive={true} 
                                on:featureMouseOver={onFeatureMouseOver} 
                                on:featureMouseOut={onFeatureMouseOut} 
                                on:featureClick={onFeatureClick} 
                            />
                        {:else}
                            <Map 
                                bind:this={refs[i]}
                                {activeViewID} {activeEraID} {activeStopID}
                                url={map.url} 
                                topoJson={map.topoJson}
                                topoJsonObjectsName={map.topoJsonObjectsName}
                                geometryType={map.geometryType? map.geometryType : 'polygons'} 
                                id={map.id} 
                                projection={projection} 
                                visible={(activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id))} 
                            />
                        {/if}
                    {:else if map.type == "tile"}
                        <TileMap 
                            bind:this={refs[i]}
                            urlPath={map.urlPath} 
                            urlExtension={map.urlExtension} 
                            projection={projection} 
                            visible={(activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id))} 
                        />
                    {:else if map.type == "label"}
                        {#if map.interactive}
                            <Labels 
                                bind:this={refs[i]}
                                {activeViewID} {activeEraID} {activeStopID}
                                path={map.path} 
                                id={map.id} 
                                projection={projection} 
                                visible={(activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id))} 
                                labelField={map.labelField}
                                filterOnContext={map.filterOnContext} 
                                interactive={map.interactive}  
                                on:featureMouseOver={onFeatureMouseOver} 
                                on:featureMouseOut={onFeatureMouseOut} 
                                on:featureClick={onFeatureClick} 
                            />
                        {:else}
                            <Labels 
                                bind:this={refs[i]}
                                {activeViewID} {activeEraID} {activeStopID}
                                path={map.path} 
                                id={map.id} 
                                projection={projection} 
                                visible={(activeStopID == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopID && story.views[activeViewID].stops[activeStopID].maps && story.views[activeViewID].stops[activeStopID].maps.includes(map.id))} 
                                labelField={map.labelField}
                                filterOnContext={map.filterOnContext} 
                                interactive={map.interactive}  
                            />
                        {/if}
                    {/if}
                    {/if}
                {/each}
            {/if}
         </g>
    </svg>
</div>


<style>

    #map {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #map-svg {
        position: absolute;
        width: 100%;
        height: 100%;
        bottom: 0;
    }

    #map-svg.story {
        height: calc(60% - 40px);
    }

    #story-narrative-container {
        position: absolute;
        z-index: 999;

        top: 40px;
        height: 40%;
        width: 100%;
        border-bottom: 1px solid lightgray;
        opacity: 0.9;
        background-color: white;
        padding: 10px;

        /* background:#7f7f7f; */
        overflow-x: hidden;
        overflow-y: auto;
    }

    #story-context-container {
        display: none;
    }

    #story-narrative {
        padding: 5px 10px;
    }


    #story-narrative h1 {
        font-size: 2em;
        font-weight: 600;
        margin-top: 0;
    }

    #story-narrative h2 {
        font-size: 1.25em;
        font-weight: 500;
        margin-top: 0;
    }

    /* Styles for .view-intro */
    .view-intro #story-narrative h1, .view-intro #story-narrative h2 {
        color: #83BC6E;
    }

    /* Styles for .era-pre-colonial */
    .era-pre-1600s #story-narrative h1, .era-pre-1600s #story-narrative h2, .era-pre-1600s #era-long-label {
        color: var(--color-era-pre-1600s) !important;
    }

    .era-pre-1600s #era-short-label {
        background-color: var(--color-era-pre-1600s) !important;
    }

    /* Styles for .era-early-european-settlement */
    .era-early-european-settlement #story-narrative h1, .era-early-european-settlement #story-narrative h2, .era-early-european-settlement #era-long-label {
        color: var(--color-era-early-european-settlement) !important;
    }    

    .era-early-european-settlement #era-short-label {
        background-color: var(--color-era-early-european-settlement) !important;
    }

    /* Styles for .era-urban-industrial-era */
    .era-urban-industrial #story-narrative h1, .era-urban-industrial #story-narrative h2, .era-urban-industrial #era-long-label {
        color: var(--color-era-urban-industrial);
    } 

    .era-urban-industrial #era-short-label {
        background-color: var(--color-era-urban-industrial) !important;
    }
    
    /* Styles for .era-migration */
    .era-era-migration #story-narrative h1, .era-era-pre-colonial #story-narrative h2 {
        color: #D0B000;
    } 

    /* Styles for .era-activism-deindustrialization */
    .era-activism-deindustrialization #story-narrative h1, .era-era-pre-colonial #story-narrative h2 {
        color: #E36900;
    } 

    @media screen and (min-width: 768px) {


        #map-svg, #map-svg.story {
            height: 100%;
        }

        #story-narrative-container {
            top: 44px;
            right: 40px;
            background-color:rgba(255,255,255,0.8);
            border: 1px solid lightgray;
            border-radius: 15px;
            height: 60%;
            width: 30%;
            min-width: 250px;
        }

        #story-context-container {
            display: block;
            position: absolute;
            z-index: 999;
            top: 50px;
            height: 50px;
            left: 110px;
        }

        #story-context-container #era-short-label, #story-context-container #era-long-label {
            display: inline-block;
            font-size: 1.1em;
            font-weight: 600;
        }


        #story-context-container #era-short-label {
            background-color: lightgrey;
            color: white;
            border-radius: 50px;
            padding: 0 10px;
            margin-right: 10px;
        }

    }

    @media screen and (min-width: 1200px) {

        #story-narrative-container {
            right: 80px;
        }

    }

</style>
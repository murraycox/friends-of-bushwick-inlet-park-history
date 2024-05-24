<script lang="ts">
    
    import { createEventDispatcher } from 'svelte';
    import { geoAlbers, geoMercator, geoPath } from "d3";
    import * as d3 from 'd3';

    import Map from "$lib/components/Map.svelte";
    import TileMap from "$lib/components/TileMap.svelte";
    import Labels from "$lib/components/Labels.svelte"
    import { onScroll } from "$lib/on-scroll";

    export let story = {};

    export function onChapterMouseOver(event){
        console.log("Maps:onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all of just some maps
        if (interactiveMap)
            interactiveMap.onChapterMouseOver(event);
    };

    export function onChapterMouseLeave(event){
        console.log("Maps:onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");
        // TODO Broadcast events to all of just some maps
        if (interactiveMap)
            interactiveMap.onChapterMouseLeave(event);
    };

    export function onNavigate(event){
        console.log(`Maps:onNavigate(event:${JSON.stringify(event.detail)})`);
        //Updating the current view should automatically change the visibility of the maps?
        //activeView = story.eras[event.detail.id].view;
        activeViewID = event.detail.viewID;
        activeStopId = null; //until we move through the story
        if (story.views[activeViewID].extent){
            moveMap(story.views[activeViewID].extent);
        };
    };

    let interactiveMap;
    let gMap;

    let mapWidth = 800;
    let mapHeight = 600;

    let zoom;

    let activeViewID = story.intialView;
    let activeStopId = null;

    zoom = d3.zoom()
        .on("zoom", zoomed);

    const dispatch = createEventDispatcher();

    function moveMap(extent){
        console.log(`Maps:moveMap(extent:${JSON.stringify(extent)}`);

        const rectGeoJsonExtent = getGeoJsonRect(extent);
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
        .fitSize([mapWidth, mapHeight], getGeoJsonRect(story.views[story.intialView].extent));

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
        //A stop on the narrative
        console.log(`Maps:onStop(stopID:${stopId}`);
        activeStopId = stopId;
        //look up the stop
        if (story.views[activeViewID].stops && story.views[activeViewID].stops[activeStopId]) {
            moveMap(story.views[activeViewID].stops[activeStopId].extent)
        };

    };

</script>

<div id="map">
    <div id="story-narrative-container">
        <div id="story-narrative">
            <h1 use:onScroll={onStop}>
                {story.views[activeViewID].name}
            </h1>
            {#if story.views[activeViewID].story}
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
            {/if}
            <!-- <p>Bushwick Inlet Park is a 28-acre piece of land that sits along the East River at the juncture of Greenpoint and Williamsburg.</p>
            <p>The park was created in 2005, a giveback from the City of New York to the residents of North Brooklyn as part of a massive waterfront rezoning that so far has added more than 50,000 new residents to these neighborhoods.</p>
            <p>The design of the park is guided by a master plan designed by Donna Walcavage of Stantec and endorsed through a community process in 2007.</p>
            <h2
                data-chapter-id="5678"
                use:onScroll={bleep}
            >
                When it is completed
            </h2>
            <p>Bushwick Inlet Park will be the crown jewel in the midst of 5 miles of almost continuous waterfront esplanades running from the Navy Yard to Newtown Creek.</p>
            <p>Connecting to Marsha P. Johnson East River State Park to the south and the Greenpoint Monitor Museum to the north, BIP will provide close to 36 acres of contiguous public open space directly on the East River.</p>
            <h2>But eighteen years (and counting) after the rezoning</h2>
            <p>the park is still more of a concept than a reality. As of 2023, less than a third of the park has been constructed, and it was only in the past few years that the City acquired – at great expense – the final piece of the puzzle that makes up Bushwick Inlet Park.</p> -->
        </div>
    </div>
    <svg id="map-svg">
        <g bind:this={gMap}>         
            {#each Object.values(story.maps) as map }
                {#if map.type == "shapefile"}
                    {#if map.interactive}
                        <Map 
                            bind:this={interactiveMap} 
                            url={map.url} 
                            geometryType={map.geometryType? map.geometryType : 'polygons'} 
                            id={map.id} projection={projection} 
                            visible={(activeStopId == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopId && story.views[activeViewID].stops[activeStopId].maps && story.views[activeViewID].stops[activeStopId].maps.includes(map.id))} 
                            interactive={true} 
                            on:featureMouseOver={onFeatureMouseOver} 
                            on:featureMouseOut={onFeatureMouseOut} 
                            on:featureClick={onFeatureClick} />
                    {:else}
                        <Map 
                            url={map.url} 
                            geometryType={map.geometryType? map.geometryType : 'polygons'} 
                            id={map.id} 
                            projection={projection} 
                            visible={(activeStopId == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopId && story.views[activeViewID].stops[activeStopId].maps && story.views[activeViewID].stops[activeStopId].maps.includes(map.id))} 
                        />
                    {/if}
                {:else if map.type == "tile"}
                    <TileMap 
                        urlPath={map.urlPath} 
                        urlExtension={map.urlExtension} 
                        projection={projection} 
                        visible={(activeStopId == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopId && story.views[activeViewID].stops[activeStopId].maps && story.views[activeViewID].stops[activeStopId].maps.includes(map.id))} 
                    />
                {:else if map.type == "label"}
                    <Labels 
                        path={map.path} 
                        id={map.id} 
                        projection={projection} 
                        visible={(activeStopId == null && story.views[activeViewID].maps && story.views[activeViewID].maps.includes(map.id)) || (activeStopId && story.views[activeViewID].stops[activeStopId].maps && story.views[activeViewID].stops[activeStopId].maps.includes(map.id))} 
                    />
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

    
    #story-narrative-container {
        position: absolute;
        z-index: 999;

        top: 40px;
        height: 45%;
        width: 100%;
        border-bottom: 1px solid lightgray;
        opacity: 0.9;
        background-color: white;
        padding: 10px;

        /* background:#7f7f7f; */
        overflow-x: hidden;
        overflow-y: auto;
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

    @media screen and (min-width: 768px) {

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

    }

    @media screen and (min-width: 1200px) {

        #story-narrative-container {
            right: 80px;
        }

    }

</style>
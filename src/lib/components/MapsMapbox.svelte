<script lang="ts">
    
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';

    import { geoAlbers, geoMercator, geoPath } from "d3";
    import * as d3 from 'd3';

    import mapboxgl from "mapbox-gl";
    //const {Map} = pkg;

    import 'mapbox-gl/dist/mapbox-gl.css';

    const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1IjoiZmJpcCIsImEiOiJjbHloaXg2NGYwNHJvMmtvc2w0dzFlNXEwIn0.OCmKB39yza8-rECY_XBQNw"

    let map;
    let mapContainer;
    let lng, lat, zoom;

    const addedLayers = [];

    lng = -73.94;
    lat = 40.72;
    zoom = 12;

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
        // Change the style of the map?
        // if (story.views[activeViewID].mapbox)
        //     map.setStyle(story.views[activeViewID].mapbox.style);

        // Get the Mapbox style for this viee

        // Get all of the Mapbox layers for this style
        addedLayers.forEach(addedLayer => {
            map.setLayoutProperty(addedLayer, 'visibility', 'none');
        });
        if (story.views[activeViewID].mapbox && story.views[activeViewID].mapbox.layers) {
            story.views[activeViewID].mapbox.layers.forEach(layer => {
                if (layer.sourceId){ 
                    if (map.getSource(layer['source-layer'])){
                        map.setLayoutProperty(layer.id, 'visibility', 'visible');
                    } else {
                        const newSource = {    
                            "type": "vector",
                            "url": `mapbox://${layer.sourceId}` //era_3_polys"
                        };
                        map.addSource(layer['source-layer'], newSource);
                        console.log(newSource);
                        const newLayer = {
                            "id": layer.id,
                            'source': layer['source-layer'],
                            'source-layer': layer['source-layer'],
                            "type": layer.type,
                            "paint": layer.paint
                        };
                        console.log(newLayer);
                        map.addLayer(newLayer);
                        addedLayers.push(layer.id);
                    };
                };
                
            });
        }



        if (!map.getSource('era-3-labels')) {
            // map.addSource('era-3-polys', {    
            //     "type": "vector",
            //     "url": "mapbox://fbip.clzuehiws3ed61moip7d0fgxl-10qk7" //era_3_polys
            // });
            // map.addLayer({
            //     "id": "era-3-polys",
            //     'source': 'era-3-polys',
            //     'source-layer': 'era_3_polys',
            //     "type": "fill",
            //     "paint": {
            //     "fill-emissive-strength": 1,
            //     "fill-color": "rgba(255, 255, 255, 0)",
            //     "fill-outline-color": "#b658fe",
            //     "fill-pattern": [
            //         "match",
            //         [
            //         "get",
            //         "chapter"
            //         ],
            //         [
            //         "01",
            //         "03"
            //         ],
            //         "lines_purple_45",
            //         [
            //         "step",
            //         [
            //             "id"
            //         ],
            //         "lines_purple_hatch",
            //         1,
            //         "lines_purple_hatch"
            //         ]
            //     ]
            //     }
            // });



            map.addSource('era-3-labels', {    
                "type": "vector",
                "url": "mapbox://fbip.clzueqatu71po1mo56ryrbjl1-9rohu" //era_3_labels
            });
            map.addLayer(  {
                "id": "era-3-labels",
                "source": "era-3-labels",
                "source-layer": "era_3_labels",
                "type": "symbol",
                "paint": {
                "text-color": "#7f2ead",
                "text-halo-color": "rgba(255, 255, 255, 0.88)",
                "text-halo-width": 1,
                "text-halo-blur": 0.5
                },
                "layout": {
                "text-field": [
                    "to-string",
                    [
                    "get",
                    "label"
                    ]
                ],
                "text-font": [
                    "Source Sans Pro Bold",
                    "Arial Unicode MS Regular"
                ]
                }
            });
            map.setLayoutProperty('era-3-labels', 'visibility', 'none');



            
        };

        if (activeViewID == 'urban-industrial'){
            map.setLayoutProperty('era-3-labels', 'visibility', 'visible');
        }

        // Move the map
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

    // let zoom;

    let activeViewID = story.intialView;
    let activeEraID = null;
    let activeStopID = null;

	let projection;

    let isLoading = true;

    const ZOOM_DURATION = 4500;

    onMount(() => {
        const initialState = { lng: lng, lat: lat, zoom: zoom };

        console.log(story);
        /* Start with the intro view style */
        map = new mapboxgl.Map({
            container: mapContainer,
            accessToken: MAPBOX_PUBLIC_TOKEN,
            style: story.baseMap.mapbox.style, //'mapbox://styles/fbip/cm03wuvt700av01qve4td1x0q', //story.views.intro.mapbox.style, // `mapbox://styles/fbip/clyhpvk0l01mp01qohk3w15tr`,
            center: [initialState.lng, initialState.lat],
            zoom: initialState.zoom
        });

    });

    // onDestroy(() => {
    //     map.remove();
    // });

    // zoom = d3.zoom()
    //     .on("zoom", zoomed);

    // const dispatch = createEventDispatcher();

    function moveMap(extent){
        console.log(`Maps:moveMap(extent:${JSON.stringify(extent)}`);

        map.fitBounds([
            [extent.nwLng, extent.nwLat], // [lng, lat] - southwestern corner of the bounds
            [extent.seLng, extent.seLat] // [lng, lat] - northeastern corner of the bounds
        ]);

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
                {story.eras[activeEraID].longLabel}
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
    <div class="map" bind:this="{mapContainer}" />
</div>


<style>

    #map, .map {
        position: absolute;
        width: 100%;
        height: 100%;
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
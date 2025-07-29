<script lang="ts">
    // import IntersectionObserver from './IntersectionObserver.svelte';

    import { createEventDispatcher, onMount, onDestroy } from 'svelte';

    import { geoAlbers, geoMercator, geoPath } from "d3";
    import * as d3 from 'd3';

    import mapboxgl from "mapbox-gl";
    //const {Map} = pkg;

    import 'mapbox-gl/dist/mapbox-gl.css';

    import water2_larger_svg from '$lib/images/mapbox/water2_larger.svg';
    import wetlands_small_svg from '$lib/images/mapbox/wetlands_small.svg';

    const MAPBOX_PUBLIC_TOKEN = "pk.eyJ1IjoiZmJpcCIsImEiOiJjbHloaXg2NGYwNHJvMmtvc2w0dzFlNXEwIn0.OCmKB39yza8-rECY_XBQNw"

    let map;
    let mapContainer = $state();
    let lng, lat, zoom;

    const addedLayers = [];

    lng = -73.94;
    lat = 40.72;
    zoom = 12;

    import { onScroll } from "$lib/on-scroll";

    import styles from '$lib/styles.js';

    let { story } = $props();

    export function onChapterMouseOver(event){
        console.log("MapsMapbox:onChapterMouseOver(event:" + JSON.stringify(event.detail) + ")");
        //change style of features associated with the chapter, if it's on the screen
        // map.setFeatureState(
        //     {
        //         source: 'era_1_labels',
        //         sourceLayer: 'era_1_labels',
        //         id: 5,
        //     },
        //     {hover: true}
        // );

        // map.setFilter(
        //     'pre-1600s-era-1-labels', 
        //     ['==', 'chapter', event.detail.id]
        // ); //e.g. 'the-creek'


        story.views[activeViewID].mapbox.layers.forEach(layer => {
            if (layer.id.substring(0, 2) == "h-") {
                console.log(`Sending hover vibes to layer ${layer.id}`);
                map.setFilter(
                    `${activeViewID}-${layer.id}`, 
                    [
                        "match",
                        ["get", "chapter"],
                        [event.detail.id],
                        true,
                        false
                    ]
                );
                map.setLayoutProperty(`${activeViewID}-${layer.id}`, 'visibility', 'visible'); //should be 'visible', but may be hidden in the MapBox style?
            };
        });
    };

    export function onChapterMouseLeave(event){
        console.log("Maps:onChapterMouseLeave(event:" + JSON.stringify(event.detail) + ")");

        story.views[activeViewID].mapbox.layers.forEach(layer => {
            if (layer.id.substring(0, 2) == "h-") {
                console.log(`Removing hover vibes from layer ${layer.id}`);
                map.setLayoutProperty(`${activeViewID}-${layer.id}`, 'visibility', 'none'); //should be 'visible', but may be hidden in the MapBox style?
            };
        });
        
    };

    export function onNavigate(event){
        console.log(`Maps:onNavigate(event:${JSON.stringify(event.detail)})`);
        //console.log(`story: ${JSON.stringify(story)}`);
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
            let debugMapboxLayersForActiveView = "";
            story.views[activeViewID].mapbox.layers.forEach(layer => {
                if (layer.sourceId){ 
                    if (layer.visibility != 'none'){
                        if (layer.id.substring(0,2) == 'h-' || !layer.layout || (layer.layout && layer.layout.visibility != 'none')){
                            debugMapboxLayersForActiveView += layer['source-layer'] + '\n';
                            if (!map.getSource(layer['source-layer'])){
                                const newSource = {    
                                    "type": "vector",
                                    "url": `mapbox://${layer.sourceId}` //era_3_polys"
                                };
                                map.addSource(layer['source-layer'], newSource);
                                console.log(`Adding source:${JSON.stringify(newSource)}`); 
                            }
                            if (!map.getLayer(`${activeViewID}-${layer.id}`)) {
                                const newLayer = {
                                    "id": `${activeViewID}-${layer.id}`,
                                    'source': layer['source-layer'],
                                    'source-layer': layer['source-layer'],
                                    "type": layer.type,
                                    "paint": layer.paint,
                                    "filter": layer.filter? layer.filter : true
                                };
                                if (layer.layout)
                                    newLayer.layout = layer.layout;
                                console.log(newLayer);
                                map.addLayer(newLayer);
                                addedLayers.push(`${activeViewID}-${layer.id}`);
                            };
                            if (layer.id.substring(0,2) != 'h-'){
                                map.setLayoutProperty(`${activeViewID}-${layer.id}`, 'visibility', layer.visibility); //should be 'visible', but may be hidden in the MapBox style?
                            };
                        };
                    };
                };                
            });
            console.log(`Mapbox Layers for View ${activeViewID}:\n${debugMapboxLayersForActiveView}`)
        }

        // Move the map
        if (story.views[activeViewID].extent){
            moveMap(story.views[activeViewID].extent);
        };

        // Setup observer if we are on the Intro, remove it otherwise.
        if (observer) {
            observer.disconnect();
            if (activeViewID == "intro") {
                console.log(`onNavigate: Setting up the Observer`)
                setUpObserver();
            }
        }

    };

    let refs = [];
    let interactiveMap;
    let svgMap;
    let gMap;

    let mapWidth;
    let mapHeight;

    // let zoom;

    let activeViewID = $state(story.intialView);
    let activeEraID = $state(null);
    let activeStopID = $state(null);

    let storyNarrative = $state(null); // This variable will hold the reference


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
            zoom: initialState.zoom,
            logoPosition: 'bottom-right'
        });

        map.on('load', function () {

            //water2_larger
            //wetlands_small
            let water2_larger_img = new Image(30,30);
            water2_larger_img.onload = ()=>map.addImage('water2_larger', water2_larger_img);
            water2_larger_img.src = water2_larger_svg;

            let wetlands_small_img = new Image(30,30);
            wetlands_small_img.onload = ()=>map.addImage('wetlands_small', wetlands_small_img);
            wetlands_small_img.src = wetlands_small_svg;

            onNavigate({
                detail: {
                    viewID: "intro",
                    eraID: null
                }
            });

        });

        if (storyNarrative) {

            observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            // The header is now in view
                            console.log(`Header is in view!:${entry.target.innerText}`);
                            //find the stop in the current view
                            if (story.views[activeViewID].stops){
                                Object.values(story.views[activeViewID].stops).forEach(stop => {
                                    // console.log(`Comparing: stop heading "${stop.heading}" to narrative header "${entry.target.innerText}"`);
                                    if (stop.heading == entry.target.innerText){
                                        console.log(`We found stop: ${stop.id}!`);   
                                        if (stop.extent)                             
                                            moveMap(stop.extent);

                                        story.views[activeViewID].mapbox.layers.forEach(layer => {
                                            if (layer.id.substring(0, 2) == "h-") {
                                                console.log(`Sending hover vibes to layer ${layer.id}`);
                                                map.setFilter(
                                                    `${activeViewID}-${layer.id}`, 
                                                    [
                                                        "match",
                                                        ["get", "chapter"],
                                                        [stop.heading],
                                                        true,
                                                        false
                                                    ]
                                                );
                                                map.setLayoutProperty(`${activeViewID}-${layer.id}`, 'visibility', 'visible'); //should be 'visible', but may be hidden in the MapBox style?
                                            };
                                        });



                                    }
                                });
                            }
                        } else {
                            // The header is no longer in view
                            // console.log('Header is out of view!');
                        }
                    });
                }, {
                    // Optional options for the observer
                    // root: null, // Defaults to the viewport
                    // rootMargin: '0px', // No margin around the root
                    // threshold: 0.1 // Trigger when 10% of the header is visible
                }
            );
            setUpObserver();
            // Clean up the event listener when the component unmounts
            // return () => {
            //   storyNarrativeHeaders.removeEventListener('scroll', handleScroll);
            // };
        }
    });

    let observer; //we set this up in the onMount

    function setUpObserver() {
          
        if (observer && storyNarrative) {

            const storyNarrativeHeaders = storyNarrative.querySelectorAll('h1,h2');
            if (storyNarrativeHeaders) {
                console.log(`setUpObserver: storyNarrativeHeaders: ${storyNarrativeHeaders}`);
                storyNarrativeHeaders.forEach(element => {
                    observer.observe(element);
                });
            }
        }
    };

    const handleScroll = () => {
        // Your scroll event logic here
        console.log('Heading scrolled!');
    };

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

    function scrollNarrativeDown(){
        if (storyNarrative){
            storyNarrative
                .lastElementChild
                .scrollIntoView({ behavior: 'smooth', block: 'end' });    
    }};

</script>

<div id="map" class="{`view-${activeViewID}`} {`era-${activeEraID}`} {`stop-${activeStopID}`}"
    style="--color-era-urban-industrial: {styles.colorEraUrbanIndustrial}; --color-era-early-european-settlement: {styles.colorEraEarlyEuropeanSettlement}"
>
    <div id="header">
        <div id="story-context-container">
            {#if activeEraID}
                <!-- <div id="era-short-label">
                    {story.eras[activeEraID].shortLabel}
                </div> -->
                <div id="era-long-label">
                    {story.eras[activeEraID].longLabel}
                </div>
            {:else}
                <div id="era-long-label">
                    The History of Bushwick Inlet Park
                </div>
            {/if}
        </div>
        <div id="header-logo">
            <img src="images/fbip_logo_wh.png" alt="Friends of Bushwick Inlet Park Logo" />
        </div>
    </div>
    {#if story.views[activeViewID].story}
        <div id="story-narrative-container">
            <div id="story-narrative-viewport">
                <div id="story-narrative" bind:this={storyNarrative}>
                    <!-- <h1 use:onScroll={onStop}>
                        {story.views[activeViewID].name}
                    </h1> -->
                    <h1>
                        {story.views[activeViewID].name}
                    </h1>
                        {@html story.views[activeViewID].introContent}

                        <!-- {#each story.views[activeViewID].story as storyElement}
                            {#if storyElement.type == "h"}
                                {#if storyElement.stop}
                                    <h2 use:onScroll={onStop} data-id={storyElement.stop}>{@html storyElement.text}</h2>
                                {:else}
                                    <h2>{@html storyElement.text}</h2>
                                {/if}
                            {:else if storyElement.type == "p"}
                                <p>{@html storyElement.text}</p>
                            {/if}
                        {/each} -->
                </div>
            </div>
            <div id="story-narrative-button-down" onclick={scrollNarrativeDown}>
            </div>
        </div>
    {/if}
    <div class="map" bind:this="{mapContainer}"></div>
</div>
<style>

    #map, .map {
        position: absolute;
        width: 100%;
        height: 100%;
    }

    #header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: auto;
        height: 75px;
        background-color: #ffffff66;
        z-index: 88;
    }

    #header-logo {
        text-align: right;
        margin: 10px 40px;
    }

    #story-narrative-container {
        position: absolute;
        z-index: 999;

        top: 40px;
        height: 40%;
        width: 100%;
        border-bottom: 1px solid lightgray;
    }

    #story-narrative-viewport {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0.95;
        background-color: white;
        padding: 10px;

        /* background:#7f7f7f; */
        overflow-x: hidden;
        overflow-y: auto;
    }


    #story-narrative {
        padding: 5px 10px;
    }

    #story-narrative-button-down {
        height: 48px;
        width: 48px;
        position: absolute;
        right: 10px;
        bottom: 10px;
        background-image: url($lib/images/icons/down.svg);
        cursor: pointer;
    }

    :global(#story-narrative img) {
        width: 100%;
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
    .view-intro #story-narrative h1, :global(.view-intro #story-narrative h2), .view-intro #era-long-label  {
        color: var(--color-intro) !important;
    }

    /* Styles for .era-pre-colonial */
    .era-pre-1600s #story-narrative h1, :global(.era-pre-1600s #story-narrative h2), .era-pre-1600s #era-long-label {
        color: var(--color-era-1) !important;
    }

    /* .era-pre-1600s #era-short-label {
        background-color: var(--color-era-1) !important;
    } */

    /* Styles for .era-early-european-settlement */
    .era-early-european-settlement #story-narrative h1, :global(.era-early-european-settlement #story-narrative h2), .era-early-european-settlement #era-long-label {
        color: var(--color-era-2) !important;
    }    

    /* .era-early-european-settlement #era-short-label {
        background-color: var(--color-era-early-european-settlement) !important;
    } */

    /* Styles for .era-urban-industrial-era */
    .era-urban-industrial #story-narrative h1, :global(.era-urban-industrial #story-narrative h2), .era-urban-industrial #era-long-label {
        color: var(--color-era-3) !important;
    } 

    /* .era-urban-industrial #era-short-label {
        background-color: var(--color-era-urban-industrial) !important;
    } */
    
    /* Styles for .era-migration */
    .era-era-migration #story-narrative h1, :global(.era-era-pre-colonial #story-narrative h2) {
        color: var(--color-era-4) !important;
    } 

    /* Styles for .era-activism-deindustrialization */
    .era-activism-deindustrialization #story-narrative h1, :global(.era-era-pre-colonial #story-narrative h2) {
        color: var(--color-era-5) !important;
    } 

    @media screen and (min-width: 768px) {


        #map-svg, #map-svg.story {
            height: 100%;
        }

        #story-narrative-container {
            top: 90px;
            right: 20px;
            height: 60%;
            width: 30%;
            min-width: 250px;
        }

        #story-narrative-viewport {
            background-color:rgba(255,255,255,0.8);
            border: 1px solid gray;
            border-radius: 15px;
        }

        #story-context-container {
            display: block;
            position: absolute;
            z-index: 999;
            top: 22px;
            height: 50px;
            left: 110px;
        }

        #story-context-container #era-short-label, #story-context-container #era-long-label {
            /* display: inline-block; */
            font-size: 2em;
            font-weight: 700;
            color: darkgray;
        }

    }

    /* @media screen and (min-width: 1200px) {

        #story-narrative-container {
            right: 80px;
        }

        #story-context-container {
            left: 150px;
        }

    } */

</style>
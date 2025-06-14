<script lang="ts">

	import { onMount, createEventDispatcher } from 'svelte';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';

	import * as d3 from 'd3';

	import { error } from '@sveltejs/kit';
	import { parse } from 'svelte/compiler';

    interface Props {
        eras: any;
        navigateWithinMap?: boolean;
        activeEraID?: any;
    }

    let { eras, navigateWithinMap = true, activeEraID = $bindable(null) }: Props = $props();

    export function onMapFeatureMouseOver(event){
        console.log("NavTimeline:onMapFeatureMouseOver(event:" + JSON.stringify(event.detail) + ")");
        onMouseOver(event.detail.featureID);
    }

    export function onMapFeatureMouseOut(event){
        console.log("NavTimeline:onMapFeatureMouseOut(event:" + JSON.stringify(event.detail) + ")");
        onMouseLeave(event.detail.featureID);
    }

    export function onMapFeatureClick(event){
        console.log("NavTimeline:onMapFeatureClick(event:" + JSON.stringify(event.detail) + ")");
        onChapterClick(event.detail.featureID);
    }

    export function onNavigate(event){
        console.log(`NavTimeline:onNavigate(event:${JSON.stringify(event.detail)})`);
        
        activeEraID = event.detail.eraID;

        recalculateActiveChapters();
        redrawTimeline();
    };


    const dispatch = createEventDispatcher();


    const TIMELINE_HEIGHT = 45;
    const TIMELINE_MARGIN_TOP = 85;
    const TIMELINE_MARGIN_BOTTOM = 1; //to draw the bottom border

    const TIMELINE_ANCHOR_LENGTH = 20;

    const TIMELINE_CHAPTER_RADIUS = 9;
    const TIMELINE_ERA_RADIUS = 12;

    const TIMELINE_PADDING = 25; //LEFT and RIGHT padding
    const TIMELINE_TITLE_WIDTH = 100;

    const TIMELINE_X_DISTANCE_BETWEEN_NODES = 40;

    let gTimeline = $state(); //DOM group
    
    let currentWidth = $state();

    let erasAndActiveChapters = $state([]);

    let xTimeline = $state(d3.scaleLinear()
            .domain([0, erasAndActiveChapters.length-1]));

    onMount(() => {
        console.log("NavTimeline:onMount")
        //setupTimeline("The story of Bushwick Inlet", erasAndChapters);
        redrawTimeline();
        // window.addEventListener('resize', redrawTimeline);
    });

    function recalculateActiveChapters() {
        console.log(`NavTimeline:recalculateActiveChapters(activeEraID:${activeEraID})`);
        if (eras){
            erasAndActiveChapters = [];
            Object.values(eras).forEach((era) => {
                era.type = "era";
                erasAndActiveChapters.push(era);
                if (activeEraID && era.id == activeEraID && era.chapters) {
                    Object.values(era.chapters).forEach((chapter) => {
                        chapter.type = "chapter";
                        chapter.eraID = era.id;
                        erasAndActiveChapters.push(chapter);
                    });
                };
            });
        };
    };
    console.log(erasAndActiveChapters.length);
    
    recalculateActiveChapters();

    function onMouseOver(id){
        console.log("NavTimeline:onMouseOver(id:" + JSON.stringify(id) + ")");

        d3.selectAll("#title-" + id + ", #anchor-" + id)
            .classed("visible", true);

        // Dispatch the id of the chapter to the parent (Map page)
        dispatch('chapterMouseOver', {
            id: id
		});

        //TODO highlight matching features on the map
        // d3.selectAll(".map ." + d.id)
        //     .classed("selected", true);

    };

    function onMouseLeave(id){
        console.log("NavTimeline:onMouseLeave(id:" + JSON.stringify(id) + ")");

        d3.timeout(
                    function(){
                        d3.selectAll("#title-" + id + ", #anchor-" + id)
                            .classed("visible", false);
                    }, 100);

        dispatch('chapterMouseLeave', {
            id: id
		});

    };

    function onChapterClick(id){
        // lookup the chapter
        Object.values(eras).forEach((era) => {
            Object.values(era.chapters).forEach((chapter) => {
                if (chapter.link && chapter.id == id )
                    window.location = base + chapter.link;
            });
        }); 
    };

    function onEraClick(id){
        console.log(`NavTimeline:onEraClick(${id})`);
        if (navigateWithinMap) {
            dispatch('navigate', {
                viewID: eras[id].view,
                eraID: id
            });
        } else {
            goto(base==''?'/':base);
        };
    };
    
    function redrawTimeline(){

        //const currentTimelineContainerWidth = parseInt(d3.select('#timeline-container').style('width'), 10);
        //When all of the nodes are closed, this will be TIMELINE_PADDING = 25 TIMELINE_X_DISTANCE_BETWEEN_NODES = 40
        // (25 * 2) + ((5 - 1) * 40) = 210
        const newTimelineContainerWidth = (TIMELINE_PADDING * 2) + ((erasAndActiveChapters.length-1) * TIMELINE_X_DISTANCE_BETWEEN_NODES)
        d3.select('#timeline-container').style('width', newTimelineContainerWidth + 'px');

        currentWidth = parseInt(d3.select('#timeline').style('width'), 10);
        console.log(currentWidth);
        //We only need to update the range (the domain doesn't change), but we recreate the whole object to force it to render
        xTimeline = d3.scaleLinear()
            .domain([0, erasAndActiveChapters.length-1])
            .range([ TIMELINE_PADDING, currentWidth-TIMELINE_PADDING ]);
    
    };

</script>

<div 
    id="timeline-container" 
    class="position-fixed"
>
    <div id="timeline-titles">
        {#each erasAndActiveChapters as eraOrActiveChapter,i}
        <div 
            id={"title-" + eraOrActiveChapter.id} 
            class="timeline-title-container {`era-${eraOrActiveChapter.type == "era"? eraOrActiveChapter.id : eraOrActiveChapter.eraID }`}"
            style={`left:${xTimeline(i) - (TIMELINE_TITLE_WIDTH/2)}px`}
        >
            <div class="story-controller-timeline-era-title">
                {eraOrActiveChapter.name}
            </div>
        </div>
        {/each}
    </div>
    <div id="timeline" class:no-active-era={(!activeEraID)}>
        <svg width="100%" height="100%">
            <g bind:this={gTimeline}>
                <!-- Background of the timeline -->
                <rect class="timeline-background" 
                    x=0 
                    y={TIMELINE_MARGIN_TOP} 
                    height={TIMELINE_HEIGHT}
                    width={currentWidth} 
                    rx={TIMELINE_HEIGHT/2}
                    ry={TIMELINE_HEIGHT/2}
                />
                <!-- Horizontal axis of the Line  -->
                <line 
                    x1={TIMELINE_PADDING}
                    y1={TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2)}
                    y2={TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2)}
                    x2={currentWidth-TIMELINE_PADDING} 
                    stroke-width=1
                    stroke="grey"
                />
                {#each erasAndActiveChapters as eraOrActiveChapter,i}
                <g 
                    class="timeline-era-and-chapter-group"
                    transform={`translate(${xTimeline(i)},${(TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2) - TIMELINE_ANCHOR_LENGTH)})`}
                >
                    <line 
                        class="timeline-node-anchors"
                        id={`anchor-${eraOrActiveChapter.id}`}
                        x1=0
                        y1=0
                        x2=0
                        y2={TIMELINE_ANCHOR_LENGTH}
                        stroke-width=1
                        stroke="grey"
                    />
                    <circle 
                        cx=0
                        cy={TIMELINE_ANCHOR_LENGTH}
                        r={eraOrActiveChapter.type == "era" ? TIMELINE_ERA_RADIUS : TIMELINE_CHAPTER_RADIUS}
                        class:era={(eraOrActiveChapter.type == "era")}
                        class:chapter={(eraOrActiveChapter.type == "chapter")}
                        class="{`era-${eraOrActiveChapter.type == "era"? eraOrActiveChapter.id : eraOrActiveChapter.eraID }`}"
                        class:active-era={((eraOrActiveChapter.type == "era" && eraOrActiveChapter.id == activeEraID) || (eraOrActiveChapter.type == "chapter" && eraOrActiveChapter.eraID == activeEraID))}
                        stroke-width=1
                        stroke="#707070"
                        onmouseover={() => onMouseOver(eraOrActiveChapter.id)}
                        onmouseleave={() => onMouseLeave(eraOrActiveChapter.id)}
                        onclick={() => {
                            if (eraOrActiveChapter.type == "chapter")
                                onChapterClick(eraOrActiveChapter.id)
                            else
                                onEraClick(eraOrActiveChapter.id, eraOrActiveChapter.name);
                        }}
                    />

                </g>                    
                {/each}
            </g>
        </svg>
    </div>
</div>


<style>

    #timeline-container {
        font-family: 'Public Sans', sans-serif;
        position: absolute;
        bottom: 10px;
        right: 300px;
        /* max-width: 600px;
        min-width: 400px; */
        width: 210px; /* calc(30%); */
        /* box-sizing: border-box; */
        height: 95px;
    }

    #timeline-container.collapsed {
    height: 50px;
    }

    #timeline h1 {
    color: #70AC00;
    }

    .timeline-node-anchors {
        visibility: hidden;
    }

    .timeline-node-anchors.visible {
        visibility: visible;
    }

    #timeline-container h1 {
    position: absolute;
    bottom: 10px;
    width: 150px;
    font-weight: 600;
    margin-block-start: 0;
    margin-block-end: 0;
    font-size: 1.1em;
    cursor: pointer;
    }

    #timeline, #timeline-titles {
    position: absolute;
    left: 0;
    right: 0;
    }

    #timeline {
    bottom: 10px; 
    height: 131px; /* TIMELINE_MARGIN_TOP + TIMELINE_MARGIN_BOTTOM + TIMELINE_HEIGHT */
    }

    /* styles for generated components have to be global */
    :global(#timeline .timeline-background) {
        fill: white;
        fill-opacity: 0.4;
        stroke-width: 1px;
        stroke: lightgrey;
    }

    /* Styles for .era-pre-colonial */
    .era-pre-colonial rect.timeline-background {
    fill: #599FF0;
    }

    /* Styles for .era-urban-industrial */
    .era-urban-industrial rect.timeline-background {
    fill: #a160c1a7;
    }

    :global(#timeline circle) {
        cursor: pointer;
    }

    #timeline circle {
    fill: black;
    }

    #timeline-titles {
        height: 47px;
        top: 0;
        visibility: hidden;
        /* padding-bottom: 71px; */
    }

    #timeline-titles .visible {
        visibility: visible;
    }

    .timeline-title-container {
        position: absolute;
        cursor: pointer;
    }

    .timeline-title-container {
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 43px;
        width: 100px;
        border: 1px solid #53A3D5;
        border-radius: 10px;
        font-size: 0.60em;
        font-weight: 700;
        padding: 1px;
        z-index: 9;
    }

    .timeline-title-container {
        color: white;
    }

    /* Styles for .era-pre-colonial */
    #timeline circle {
        fill: #9D9D9D; /* for circle */
    }

    /* Styles for .era-pre-colonial */
    #timeline.no-active-era circle.era-pre-1600s, #timeline circle.active-era.era-pre-1600s, .timeline-title-container.era-pre-1600s {
        fill: var(--color-era-1); /* for circle */
        background-color: var(--color-era-1); /* for div */
    }

    /* Styles for .era-early-european-settlement */
    #timeline.no-active-era circle.era-early-european-settlement, #timeline circle.active-era.era-early-european-settlement, .timeline-title-container.era-early-european-settlement {
        fill: var(--color-era-2);
        background-color: var(--color-era-2); /* for div */
    }    

    /* Styles for era-urban-industrial-era */
    #timeline.no-active-era circle.era-urban-industrial, #timeline circle.active-era.era-urban-industrial, .timeline-title-container.era-urban-industrial {
        fill: var(--color-era-3);
        background-color: var(--color-era-3); /* for div */
    }
    
    /* Styles for .era-migration */
    #timeline.no-active-era circle.era-deindustrialization, #timeline circle.active-era.era-deindustrialization, .timeline-title-container.era-deindustrialization  {
        fill: var(--color-era-4);
        background-color: var(--color-era-4); /* for div */
    } 

    /* Styles for .era-activism-deindustrialization */
    #timeline.no-active-era circle.era-the-future, #timeline circle.active-era.era-the-future, .timeline-title-container.era-the-future {
        fill: var(--color-era-5);
        background-color: var(--color-era-5); /* for div */
    }

    #timeline div.era { 
        display: inline-block;
        border: 1px solid black;
        padding: 1em;  
        margin-right: 5em;
        position:relative
    }
    
    #timeline div.era:before,
    #timeline div.era:after
    {
        content:'';
        width:5em;
        border-bottom:1px solid;
        position:absolute;
        top:50%;
    
    }
    :after {
        left:100%;
    }
    :before {
        right:100%;
    }
    #timeline div.era:first-of-type:before,
    #timeline div.era:last-of-type:after {
        display:none;
    }


    /* Mobile first positioning */

    #timeline-container {
        left: 20px;
    }

    /* @media screen and (min-width: 1200px) {

        #timeline-container {
            left: 80px;
        }
    

    } */


</style>
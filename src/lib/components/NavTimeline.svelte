<script>

	import { onMount, createEventDispatcher } from 'svelte';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';

	import * as d3 from 'd3';

	import { error } from '@sveltejs/kit';

    export let eras;
    export let navigateWithinMap = true;
    export let activeEraID = null;

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

    const TIMELINE_CHAPTER_RADIUS = 4;
    const TIMELINE_ERA_RADIUS = 6;

    const TIMELINE_PADDING = 25; //LEFT and RIGHT padding
    const TIMELINE_TITLE_WIDTH = 80;

    let gTimeline; //DOM group
    
    let currentWidth;

    let erasAndActiveChapters = [];

    let xTimeline = d3.scaleLinear()
            .domain([0, erasAndActiveChapters.length-1]);

    onMount(() => {
        console.log("NavTimeline:onMount")
        //setupTimeline("The story of Bushwick Inlet", erasAndChapters);
        redrawTimeline();
        window.addEventListener('resize', redrawTimeline);
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
            goto(base);
        };
    };
    
    function redrawTimeline(){

        currentWidth = parseInt(d3.select('#timeline').style('width'), 10);
        console.log(currentWidth);
        //We only need to update the range (the domain doesn't change), but we recreate the whole object to force it to render
        xTimeline = d3.scaleLinear()
            .domain([0, erasAndActiveChapters.length-1])
            .range([ TIMELINE_PADDING, currentWidth-TIMELINE_PADDING ]);
    
    };

</script>

<div id="timeline-container" class="position-fixed">
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
    <div id="timeline">
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
                    <circle 
                        cx=0
                        cy={TIMELINE_ANCHOR_LENGTH}
                        r={eraOrActiveChapter.type == "era" ? TIMELINE_ERA_RADIUS : TIMELINE_CHAPTER_RADIUS}
                        class:era={(eraOrActiveChapter.type == "era")}
                        class:chapter={(eraOrActiveChapter.type == "chapter")}
                        class="{`era-${eraOrActiveChapter.type == "era"? eraOrActiveChapter.id : eraOrActiveChapter.eraID }`}"
                        stroke-width=1
                        stroke="grey"
                        on:mouseover={() => onMouseOver(eraOrActiveChapter.id)}
                        on:mouseleave={() => onMouseLeave(eraOrActiveChapter.id)}
                        on:click={() => {
                            if (eraOrActiveChapter.type == "chapter")
                                onChapterClick(eraOrActiveChapter.id)
                            else
                                onEraClick(eraOrActiveChapter.id, eraOrActiveChapter.name);
                        }}
                    />
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
        bottom: 25px;
        right: 300px;
        max-width: 600px;
        min-width: 300px;
        width: calc(35%);
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
        width: 80px;
        border: 1px solid #53A3D5;
        border-radius: 10px;
        font-size: 0.60em;
        padding: 1px;
        z-index: 9;
    }

    /* Styles for .era-pre-colonial */
    #timeline circle.era-pre-1600s, .timeline-title-container.era-pre-1600s {
        fill: #5199C7; /* for circle */
        background-color: #5199C7; /* for div */
    }

    /* Styles for .era-early-european-settlement */
    #timeline circle.era-early-european-settlement, .timeline-title-container.era-early-european-settlement {
        fill: #70AC00;
        background-color: #70AC00; /* for div */
    }    

    /* Styles for era-urban-industrial-era */
    #timeline circle.era-urban-industrial-era, .timeline-title-container.era-urban-industrial-era {
        fill: #9762AF;
        background-color: #9762AF; /* for div */
    }
    
    /* Styles for .era-migration */
    #timeline circle.era-migration, .timeline-title-container.era-migration  {
        fill: #D0B000;
        background-color: #D0B000; /* for div */
    } 

    /* Styles for .era-activism-deindustrialization */
    #timeline circle.era-activism-deindustrialization, .timeline-title-container.era-activism-deindustrialization {
        fill: #E36900;
        background-color: #E36900; /* for div */
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
        left: 40px;
    }

    @media screen and (min-width: 1200px) {

        #timeline-container {
            left: 80px;
        }
    

    }


</style>
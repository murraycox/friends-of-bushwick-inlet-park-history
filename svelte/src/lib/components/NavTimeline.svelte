<script>

	import { onMount } from 'svelte';
	import * as d3 from 'd3';

    import erasAndChapters from '$lib/data/eras-and-chapters.json';

    const TIMELINE_HEIGHT = 45;
    const TIMELINE_MARGIN_TOP = 85;
    const TIMELINE_MARGIN_BOTTOM = 1; //to draw the bottom border

    const TIMELINE_ANCHOR_LENGTH = 15;

    const TIMELINE_CHAPTER_RADIUS = 5;
    const TIMELINE_ERA_RADIUS = 7;

    const TIMELINE_PADDING = 25; //LEFT and RIGHT padding
    const TIMELINE_TITLE_WIDTH = 80;

    var gTimeline;
    var xTimeline; //d3 scale

    onMount(() => {
        console.log("NavTimeline:onMount")
        initialiseTimeline();
        setupTimeline("The story of Bushwick Inlet", erasAndChapters);
        redrawTimeline();
        window.addEventListener('resize', redrawTimeline);
    });

    function initialiseTimeline(){
        // d3.select("#story-controller h1")
        //     .on('click', function() {
        //         d3.select("#story-controller").classed("collapsed", !d3.select("#story-controller").classed("collapsed"));
        //     });

        const svgTimeline = d3.select("#timeline").append("svg")
            .attr('width', "100%")
            .attr('height', "100%");
            //.attr("preserveAspectRatio", "xMinYMin meet");
            // .attr("viewBox", "0 0 100 50");

        gTimeline = svgTimeline.insert('g');

        //width gets setup in redraw
        gTimeline.append('rect')
            .attr('x', 0)
            .attr('y', TIMELINE_MARGIN_TOP)
            .attr('height', TIMELINE_HEIGHT)
            .attr('width', 300)
            .attr('rx', (TIMELINE_HEIGHT/2))
            .attr('ry', (TIMELINE_HEIGHT/2))
            .attr('fill', 'none')
            // .style('stroke-width', 1)
            // .style('stroke', "lightgrey")
            .classed("timeline-background", true);
            ; 
        
        //x2 gets setup in redraw
        gTimeline.append('line')
            .attr('x1', TIMELINE_PADDING)
            .attr('y1', TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2))
            .attr('y2', TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2))
            .style('stroke-width', 1)
            .style('stroke', "grey");
    }

    function setupTimeline(name, timeLineNodes){

        // Add X axis. Note that we don't know the range yet, so we cannot draw it.
        xTimeline = d3.scaleLinear()
            .domain([0, timeLineNodes.length-1]);

        var eraGroups = gTimeline.selectAll("g")
            .data(timeLineNodes)
            .join("g")
            .classed("timeline-era-group", true);

        var anchors = eraGroups.append("line")
            .classed("timeline-node-anchors", true)
            .attr("id", d => "anchor-" + d.id)
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', TIMELINE_ANCHOR_LENGTH)
            .style('stroke-width', 1)
            .style('stroke', "grey");

        var circles = eraGroups.append("circle")
            .attr("cx", 0)
            .attr("cy", TIMELINE_ANCHOR_LENGTH)
            .attr("r", d => d.type == "era" ? TIMELINE_ERA_RADIUS : TIMELINE_CHAPTER_RADIUS)
            .classed("era", d => d.type == "era")
            .classed("chapter", d => d.type == "chapter")
            .style("stroke", "green")
        //     // .style("fill", "green")
        //     .on('click', function(e, d){ 
        //         //transitionToView(d.view);
        //         window.location = d.link;
        //     })
            .on('mouseover', function(e, d){ 
                
                d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                    .classed("visible", true);
                
                //highlight matching features on the map
                // d3.selectAll(".map ." + d.id)
                //     .classed("selected", true);
                
            })
            .on('mouseleave', function(e, d){ 
                d3.timeout(
                    function(){
                        d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                            .classed("visible", false);
                    }, 100);

                //un-highlight matching features on the map
                // d3.selectAll(".map ." + d.id)
                //     .classed("selected", false);

            });
        //     ;

        var eraTitleContainers = d3.select("#timeline-titles")
            .selectAll("div .timeline-title-container")
            .data(timeLineNodes)
            .join("div")
            .attr("id", d => "title-" + d.id)
            .classed("timeline-title-container", true)
            .on('click', function(e, d){ 
                if (d.view)
                    transitionToView(d.view);
                else
                    setupTimeline(d.name, d.stories);
                    redrawTimeline();
            })
            // .append("div")
            // .classed("story-controller-timeline-era-title", true)
            .html(function(d){
                return d.name;
            });
        //     .on('mouseover', function(e, d){ 
        //         d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
        //             .classed("visible", true);
        //     })
        //     .on('mouseleave', function(e, d){ 
        //         d3.timeout(
        //             function(){
        //                 d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
        //                     .classed("visible", false);
        //             }, 100);
        //     })
        //     ;
    }

    function redrawTimeline(){
        
        const currentWidth = parseInt(d3.select('#timeline').style('width'), 10);
        console.log(currentWidth);

        gTimeline.select('line')
            .attr('x2', currentWidth-TIMELINE_PADDING);

        gTimeline.select('rect')
            .attr('width', currentWidth);

        xTimeline.range([ TIMELINE_PADDING, currentWidth-TIMELINE_PADDING ]);
    
        gTimeline.selectAll('.timeline-era-group')
            .attr('transform', (d, i) => "translate(" + (xTimeline(i)) + "," + (TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2) - TIMELINE_ANCHOR_LENGTH) + ")");

        const titleContainers = d3.select("#timeline-titles").selectAll(".timeline-title-container")
            .style("left", function (d, i) {
                return `${xTimeline(i) - (TIMELINE_TITLE_WIDTH/2)}px`;
            });
    };

</script>

<div id="timeline-container" class="position-fixed">
    <div id="timeline-titles">
    </div>
    <div id="timeline">
    </div>
</div>


<style>

    #timeline-container {
        font-family: 'Public Sans', sans-serif;
        position: absolute;
        bottom: 25px;
        right: 300px;
        max-width: 800px;
        min-width: 400px;
        /* width: calc(100% - 30px); */
        /* box-sizing: border-box; */
        height: 95px;
    }

    #timeline-container.collapsed {
    height: 50px;
    }

    #timeline h1 {
    color: #70AC00;
    }

    :global(.timeline-node-anchors) {
        visibility: hidden;
    }

    :global(.timeline-node-anchors .visible) {
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

    #timeline circle.era {
    fill: black;
    }

    #timeline circle.chapter {
    fill: white;
    }

    #timeline circle:hover {
    fill: green;
    }

    #timeline-titles {
        height: 52px;
        top: 0;
        visibility: hidden;
        /* padding-bottom: 71px; */
    }

    #timeline-titles .visible {
        visibility: visible;
    }

    :global(.timeline-title-container) {
        position: absolute;
        cursor: pointer;
    }

    :global(.timeline-title-container) {
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        height: 48px;
        width: 80px;
        border: 1px solid #53A3D5;
        border-radius: 10px;
        font-size: 0.60em;
        padding: 1px;
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
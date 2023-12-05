const TIMELINE_HEIGHT = 45;
const TIMELINE_MARGIN_TOP = 85;
const TIMELINE_MARGIN_BOTTOM = 1; //to draw the bottom border
const TIMELINE_ERA_ANCHORS_LENGTH = 33;
const TIMELINE_CHAPTER_RADIUS = 3;
const TIMELINE_ERA_RADIUS = 5;
const TIMELINE_PADDING = 25; //LEFT and RIGHT padding
const TIMELINE_TITLE_WIDTH = 80;

var gTimeline;
var xTimeline; //d3 scale



const erasAndChapters = [
    {
        "id": "pre-1600s",
        "name": "Pre 1600s",
        "type": "era", 
        "link": null
    },
    {
        "id": "early-european-settlement",
        "name": "Early European Settlement",
        "type": "era", 
        "link": null
    },
    {   
        "id": "urban-industrial-area",
        "name": "Urban + Industrial Area",
        "type": "era", 
        "link": null
    },
    {
        "id": "chapter-sugar",
        "name": "Sugar",
        "type": "chapter", 
        "link": "index10-intro.html"
    },
    {
        "id": "chapter-gas-petroleum",
        "name": "Gas + Petroleum",
        "type": "chapter", 
        "link": "index10-gas-petroleum.html"
    },
    {
        "id": "chapter-3",
        "name": "Another Chapter",
        "type": "chapter", 
        "link": null
    },
    {
        "id": "chapter-4",
        "name": "Another Chapter",
        "type": "chapter", 
        "link": null
    },
    {
        "id": "chapter-5",
        "name": "Another Chapter",
        "type": "chapter", 
        "link": null
    },
    {
        "id": "migration",
        "name": "Migration",
        "type": "era", 
        "link": null
    },
    {
        "id": "activism-deindustrialization",
        "name": "Activism + Deindustrialization",
        "type": "era", 
        "link": null
    },
];

initialiseTimeline();
setupTimeline("The story of Bushwick Inlet", erasAndChapters);
redrawTimeline();

function initialiseTimeline(){
    // d3.select("#story-controller h1")
    //     .on('click', function() {
    //         d3.select("#story-controller").classed("collapsed", !d3.select("#story-controller").classed("collapsed"));
    //     });

    const svgTimeline = d3.select("#story-controller-timeline").append("svg")
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
        .style('stroke-width', 1)
        .style('stroke', "grey")
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

    d3.select("#story-controller h1")
        .text(name);

    // Add X axis. Note that we don't know the range yet, so we cannot draw it.
    xTimeline = d3.scaleLinear()
        .domain([0, timeLineNodes.length-1]);

    var eraGroups = gTimeline.selectAll("g")
        .data(timeLineNodes)
        .join("g")
        .classed("timeline-era-group", true);

    var anchors = eraGroups.append("line")
        .classed("story-controller-timeline-era-anchors", true)
        .attr("id", d => "anchor-" + d.id)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', TIMELINE_ERA_ANCHORS_LENGTH)
        .style('stroke-width', 1)
        .style('stroke', "grey");

    var circles = eraGroups.append("circle")
        .attr("cx", 0)
        .attr("cy", TIMELINE_ERA_ANCHORS_LENGTH)
        .attr("r", d => d.type == "era" ? TIMELINE_CHAPTER_RADIUS : TIMELINE_ERA_RADIUS)
        .classed("era", d => d.type == "era")
        .classed("chapter", d => d.type == "chapter")
        .style("stroke", "green")
        // .style("fill", "green")
        .on('click', function(e, d){ 
            //transitionToView(d.view);
            window.location = d.link;
        })
        .on('mouseover', function(e, d){ 
            
            d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                .classed("visible", true);
            
            //highlight matching features on the map
            d3.selectAll(".map ." + d.id)
                .classed("selected", true);
            
        })
        .on('mouseleave', function(e, d){ 
            d3.timeout(
                function(){
                    d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                        .classed("visible", false);
                }, 100);

            //un-highlight matching features on the map
            d3.selectAll(".map ." + d.id)
                .classed("selected", false);

        })
        ;

    var eraTitleContainers = d3.select("#story-controller-timeline-era-titles")
        .selectAll("div .story-controller-timeline-era-title-container")
        .data(timeLineNodes)
        .join("div")
        .attr("id", d => "title-" + d.id)
        .classed("story-controller-timeline-era-title-container", true)
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
        })
        .on('mouseover', function(e, d){ 
            d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                .classed("visible", true);
        })
        .on('mouseleave', function(e, d){ 
            d3.timeout(
                function(){
                    d3.selectAll("#title-" + d.id + ", #anchor-" + d.id)
                        .classed("visible", false);
                }, 100);
        })
        ;
}

function redrawTimeline(){
    
    const currentWidth = parseInt(d3.select('#story-controller-timeline').style('width'), 10);
    console.log(currentWidth);

    gTimeline.select('line')
        .attr('x2', currentWidth-TIMELINE_PADDING);

    gTimeline.select('rect')
        .attr('width', currentWidth);

    xTimeline.range([ TIMELINE_PADDING, currentWidth-TIMELINE_PADDING ]);
 
    gTimeline.selectAll('.timeline-era-group')
        .attr('transform', (d, i) => "translate(" + (xTimeline(i)) + "," + (TIMELINE_MARGIN_TOP + (TIMELINE_HEIGHT/2) - TIMELINE_ERA_ANCHORS_LENGTH) + ")");

    const eraTitleContainers = d3.select("#story-controller-timeline-era-titles").selectAll(".story-controller-timeline-era-title-container")
        //.style("left", "500px");
        .style("left", function (d, i) {
            return `${xTimeline(i) - (TIMELINE_TITLE_WIDTH/2)}px`;
        });
        // });
}

d3.select(window).on('resize', resize);

function resize() {
    
    redrawTimeline();

}

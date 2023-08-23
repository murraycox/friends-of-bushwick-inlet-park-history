var mapNYCRegionUrl = "./gis/NYC_region_land_4326.geojson";
var mapShorelineUrl = "./gis/georeferenced_1775_shoreline_2_vector_4326.geojson";
var mapIndianVillagesUrl = "./gis/Indian_villages_ponds_paths_kings_cty_4326.geojson";
var storyURL = "./data/fbip-story.json";
var projection;

var currentView;
var zoom;
var gTimeline;
var xTimeline; //d3 scale

const storyGIS = {
    views: {
        intialView: {
            extent: {
                nwLng: -74.33736285,
                nwLat: 40.95368295,
                seLng: -73.62359621,
                seLat: 40.47071658
            },
            center: {
                lng: -73.98047953,
                lat: 40.712199765
            },
            maps: [
                'nycRegion'
            ]
        },
        bip: {
            extent: {
                nwLng: -73.96997894,
                nwLat: 40.73141617,
                seLng: -73.94609275,
                seLat: 40.71686388
            },
            center: {
                lng: -73.98047953,
                lat: 40.712199765
            },
            maps: [
                'nycRegion'
            ]
        }
    },
    maps: {
        nycRegion : {
            url: "./gis/NYC_region_land_4326.geojson",
            className: "nyc-region",
            intialVisibility: true,
        },
        bipFinalLots : {
            url: "./gis/BIP_FinalLots.geojson",
            className: "bip-final-lots",
            intialVisibility: true,
        }
    }
};

const eras = [
    {
        "name": "pre-colonial Munsee/ Lenape",
        "view": storyGIS.views.intialView
    },
    {
        "name": "Early European settlement",
        "view": storyGIS.views.bip
    },
    {
        "name": "Industrialization"
    },
    {
        "name": "Migration"
    },
    {
        "name": "Recent past / activism"
    },
    {
        "name": "the future"
    }
];

setupTimeline();
redrawTimeline();

const margin = ({ top: 10, right: 0, bottom: 0, left: 10 });

let mapWidth = document.documentElement.clientWidth; 
let mapHeight = document.documentElement.clientHeight;

const svg = d3.select("#story-container").append("svg")
    .attr('width', "100%")
    .attr('height', "100%");

// Some good svg patterns here: https://jenkov.com/tutorials/svg/fill-patterns.html
/* <pattern id="pattern4" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="10" style="stroke: none; fill: #0000ff"></circle>
    </pattern>*/
// And how to add with d3: https://stackoverflow.com/a/30865432
svg.append("defs").append("pattern")
    .attr('id','circles')
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 0.2)
    .attr("height", 0.2)
    .attr('patternUnits',"userSpaceOnUse")
    .append('circle')
    .attr('cx',0.075)
    .attr('cy',0.075)
    .attr('r',0.075)
    .attr('fill', '#70AC00');



const g = svg.append("g");

function setupTimeline(){

    d3.select("#story-controller h1")
        .on('click', function() {
            d3.select("#story-controller").classed("collapsed", !d3.select("#story-controller").classed("collapsed"));
        });

    const svgTimeline = d3.select("#story-controller-timeline").append("svg")
        .attr('width', "100%")
        .attr('height', "100%");
        //.attr("preserveAspectRatio", "xMinYMin meet");
        // .attr("viewBox", "0 0 100 50");

    gTimeline = svgTimeline.insert('g');

    //x2 gets setup in redraw
    gTimeline.append('line')
        .attr('x1', 0)
        .attr('y1', 40)
        .attr('y2', 40)
        .style('stroke-width', 1)
        .style('stroke', "grey");

    // Add X axis. Note that we don't know the range yet, so we cannot draw it.
    xTimeline = d3.scaleLinear()
        .domain([0, eras.length-1]);

    var eraGroups = gTimeline.selectAll("g")
        .data(eras)
        .enter()
        .append("g")
        .classed("timeline-era-group", true);

    var anchors = eraGroups.append("line")
        .classed("story-controller-timeline-era-anchors", true)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 30)
        .style('stroke-width', 1)
        .style('stroke', "grey");

    var circles = eraGroups.append("circle")
        .attr("cx", 0)
        .attr("cy", 25)
        .attr("r", 5)
        .style("stroke", "green")
        .style("fill", "green")
        .on('click', function(e, d){ 
            transitionToView(d.view);
        });

    var eraTitleContainers = d3.select("#story-controller-timeline-era-titles")
        .selectAll("div .story-controller-timeline-era-title-container")
        .data(eras)
        .join("div")
        .classed("story-controller-timeline-era-title-container", true)
        .on('click', function(e, d){ 
            transitionToView(d.view);
        })
        .append("div")
        .classed("story-controller-timeline-era-title", true)
        .html(function(d){
            return d.name;
        });
}

function redrawTimeline(){
    
    const TIMELINE_MARGIN = 55; //LEFT and RIGHT margin
    const TIMELINE_TITLE_WIDTH = 80; //TODO, get this at run-time?
    const currentWidth = parseInt(d3.select('#story-controller-timeline').style('width'), 10);
    console.log(currentWidth);

    gTimeline.select('line')
        .attr('x2', currentWidth-TIMELINE_MARGIN);

    xTimeline.range([ TIMELINE_MARGIN, currentWidth-TIMELINE_MARGIN ]);
 
    gTimeline.selectAll('.timeline-era-group')
        .attr('transform', (d, i) => "translate(" + (xTimeline(i)) + ",15)");

    const eraTitleContainers = d3.select("#story-controller-timeline-era-titles").selectAll(".story-controller-timeline-era-title-container")
        //.style("left", "500px");
        .style("left", function (d, i) {
            return `${xTimeline(i) - (TIMELINE_TITLE_WIDTH/2)}px`;
        });
        // });
}

function setProjection(fitSizeRect){

    projection = d3.geoAlbers()
        .rotate([74, 0]) //Rotate the projection
        .fitSize([mapWidth, mapHeight], fitSizeRect);

};

function addMap(map){

    //Do this before the map is fetched so that the order of the svg is established (first added will appear at the bottom)
    // var gMap = g.insert('g', ":first-child") //make sure it doesn't cover anything 
    //     .classed("map", true);

    var gMap = g.insert('g') //make sure it doesn't cover anything 
        .classed("map", true);

    d3.json(map.url).then(function(geoJsonData) {

        var path = d3.geoPath()
            .projection(projection);

        if (map.className)
            gMap.classed(map.className, true);

        gMap.selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path);

        //store the g in the object
        map["g"] = gMap;

        return {
            g: gMap,
            projection: projection
        };

    });
};

function getGeoJsonRect(extent){
        
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
}

function setupMap(){
    
    // Zoom functionality resources:
    // https://observablehq.com/@d3/zoom-to-bounding-box

    zoom = d3.zoom()
        .on("zoom", zoomed);

    //enable zoom mouse events on the group
    g.call(zoom);


    function zoomed(event) {
        const {transform} = event;
        g.attr("transform", transform);
        g.attr("stroke-width", 1 / transform.k);
    }
}

function transitionToView(view){

    const rectGeoJson = getGeoJsonRect(view.extent);
    var path = d3.geoPath()
        .projection(projection);
    const boundsRect = path.bounds(rectGeoJson);

    const [[x0, y0], [x1, y1]] = boundsRect; //path.bounds(d);
    g.transition()
        .duration(3000)
        .ease(d3.easeCubicOut)
        .call(
            zoom.transform,
            d3.zoomIdentity
                .translate(mapWidth / 2, mapHeight / 2) // I think this is here so that the transform implements the translate to the middle of the screen, not the top/left?
                .scale(0.9 / Math.max((x1 - x0) / mapWidth, (y1 - y0) / mapHeight))
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
        );
    currentView = view;

}

function showClickableView(view){

    const rectGeoJson = getGeoJsonRect(view.extent);
    //console.log(rectGeoJson);

    var path = d3.geoPath()
        .projection(projection);

    var gRect = g.append("g")
        .classed("story-rect", true);

    const nwPoint = projection([view.extent.nwLng, view.extent.nwLat]);
    const sePoint = projection([view.extent.seLng, view.extent.seLat]);
    
    
    const pathRect = gRect.append("rect")
        .attr("x", nwPoint[0])
        .attr("y", nwPoint[1])
        .attr("width", sePoint[0] - nwPoint[0])
        .attr("height", sePoint[1] - nwPoint[1])
        .attr("rx", 1)
        ;


    //const centerRect = [sePoint[0] - ((sePoint[0] - nwPoint[0])/2), sePoint[1] - ((sePoint[1] - nwPoint[1])/2)];
    const boundsRect = path.bounds(rectGeoJson);
    //store the rect in the view object
    view['d3'] = {bounds: boundsRect};
    
    const padding = 10;

    pathRect.on('click', function(event){ 

        event.stopPropagation();
        gRect.classed("hidden", true);
        transitionToView(view)

    });

    return {
        g: gRect,
        projection: projection
    };

};

//setProjection(getGeoJsonRect(-74.02156685, 40.75641487, -73.90592678, 40.67896399));
// Set the projection (the area displayed on the screen to the bounds of NYC with a small margin
// TODO This was done manually, should we do this programatically, based on the exact bounds of NYC, a margin, and also try and center the BIP programmatically?
setProjection(getGeoJsonRect(storyGIS.views.intialView.extent));

g0 = addMap(storyGIS.maps.nycRegion);
g1 = addMap(storyGIS.maps.bipFinalLots);

//g1 = showMap(mapShorelineUrl, "shoreline");
//g2 = showMap(mapIndianVillagesUrl, "indian-trails");

setupMap();
currentView = storyGIS.views.intialView;
g3 = showClickableView(storyGIS.views.bip)

d3.select(window).on('resize', resize);

function resize() {
    
    redrawTimeline();

    // adjust things when the window size changes
    mapWidth = document.documentElement.clientWidth; 
    mapHeight = document.documentElement.clientHeight;

    const [[x0, y0], [x1, y1]] = currentView.d3.bounds; //path.bounds(d);
    g.call(
        zoom.transform,
        d3.zoomIdentity
            .translate(mapWidth / 2, mapHeight / 2) // I think this is here so that the transform implements the translate to the middle of the screen, not the top/left?
            .scale(0.9 / Math.max((x1 - x0) / mapWidth, (y1 - y0) / mapHeight))
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2)
    )


    // const center = projection([currentView.center.lng, currentView.center.lat]); //[sePoint[0] - ((sePoint[0] - nwPoint[0])/2), sePoint[1] - ((sePoint[1] - nwPoint[1])/2)];
    // const boundsRect = [projection([currentView.extent.nwLng, currentView.extent.nwLat]),projection([currentView.extent.seLng, currentView.extent.seLat])];
 
    // const padding = 10;

    // const end = [center[0], center[1], boundsRect[1][1] + padding - boundsRect[0][1] + padding];
    // const k = Math.min(mapWidth, mapHeight) / end[2];
    // const translate = [mapWidth / 2 - end[0] * k, mapHeight / 2 - end[1] * k]
    // const transformStr = `translate(${translate}) scale(${k})`

    // g.attr("transform", transformStr);

}

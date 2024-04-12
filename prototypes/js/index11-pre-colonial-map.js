var projection;

var currentView;
var zoom;
var gTimeline;
var xTimeline; //d3 scale

const storyGIS = {
    views: {
        intialView: {
            extent: {
                nwLng: -73.97,
                nwLat: 40.735,
                seLng: -73.94,
                seLat: 40.700
            },
            center: {
                lng: -73.98047953,
                lat: 40.712199765
            },
            maps: [
                'nycRegion'
            ],
            narrativeContent: `<h1>Bushwick Inlet Park</h1>
            <p>Bushwick Inlet Park is a 28-acre piece of land that sits along the East River at the juncture of Greenpoint and Williamsburg.</p>
            <p>The park was created in 2005, a giveback from the City of New York to the residents of North Brooklyn as part of a massive waterfront rezoning that so far has added more than 50,000 new residents to these neighborhoods.</p>
            <p>The design of the park is guided by a master plan designed by Donna Walcavage of Stantec and endorsed through a community process in 2007.</p>
            <h2>When it is completed</h2>
            Bushwick Inlet Park will be the crown jewel in the midst of 5 miles of almost continuous waterfront esplanades running from the Navy Yard to Newtown Creek.</p>
            <p>Connecting to Marsha P. Johnson East River State Park to the south and the Greenpoint Monitor Museum to the north, BIP will provide close to 36 acres of contiguous public open space directly on the East River.</p>
            <h2>But eighteen years (and counting) after the rezoning</h2>
            <p>the park is still more of a concept than a reality. As of 2023, less than a third of the park has been constructed, and it was only in the past few years that the City acquired – at great expense – the final piece of the puzzle that makes up Bushwick Inlet Park.</p>`
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
            ],
            narrativeContent: `
                <h1>Waterways</h1>
                <p>More content to go here`
        },
        munseeLenape: {
            extent: {
                nwLng: -74.6,
                nwLat: 40.95368295,
                seLng: -73.3,
                seLat: 40.47071658
            },
            center: {
                lng: -73.98047953,
                lat: 40.712199765
            },
            maps: [
                'nycRegion'
            ],
            narrativeContent: `
                <h1>Munsee Lenape</h1>
                <p>Content to go here</p>`
        }
    },
    maps: {
        nycRegion : {
            url: "./gis/NYC_region_land_4326.geojson",
            className: "nyc-region",
            intialVisibility: true,
        },
        era1Story : {
            url: "./gis/1776_wetlands_polygons_4326.geojson",
            className: "era-1-polygons",
            intialVisibility: true,
        },
        era1Lines : {
            url: "./gis/1776_shoreline_polylines_4326.geojson",
            className: "era-1-polylines",
            intialVisibility: true,
        }
    }
};

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

svg.append("defs").append("pattern")
    .attr('id','circles-selected')
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 0.2)
    .attr("height", 0.2)
    .attr('patternUnits',"userSpaceOnUse")
    .append('circle')
    .attr('cx',0.075)
    .attr('cy',0.075)
    .attr('r',0.075)
    .attr('fill', '#a160c1');

const g = svg.append("g");

function setProjection(fitSizeRect){

    projection = d3.geoAlbers()
        .rotate([74, 0]) //Rotate the projection
        .fitSize([mapWidth, mapHeight], fitSizeRect);

};

function featureMouseover(e, d) {
    d3.selectAll("path")
        .classed("hover", false);
    if (d.properties && d.properties.section) { //do we want to call this section, or chapter??
        d3.select(this)
            .classed("hover", true);
    };
}

function featureClick(e, d) {
    if (d.properties && d.properties.section && d.properties.section == "Petroleum") {
        window.location = "index11-gas-petroleum";
    };
}

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

        var paths = gMap.selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("mouseover", featureMouseover)
            .on("click", featureClick);

        paths.each(function(d) {
            //TODO, see if we can use a feature property?
            if ((map.className == "bip-final-lots") && (["86 Kent", "Motiva", "Marsha P. Johnson State Park"].includes(d.properties.label)))
                this.classList.add("chapter-gas-petroleum");
            if ((map.className == "bip-final-lots") && (["Bayside"].includes(d.properties.label)))
                this.classList.add("chapter-sugar");
            if ((map.className == "bip-final-lots") && (["40 Quay"].includes(d.properties.label)))
                this.classList.add("chapter-waterfront");
            if ((map.className == "era-3-story") &&  d.properties && d.properties.section && (d.properties.section == "Petroleum"))
                this.classList.add("chapter-gas-petroleum");
        });
        
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

    if (view.narrativeContent){
        d3.select("#story-narrative-content").html(view.narrativeContent);
    };

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
g1 = addMap(storyGIS.maps.era1Story);
g2 = addMap(storyGIS.maps.era1Lines);
//g2 = addMap(storyGIS.maps.storyFeatures);

setupMap();
currentView = storyGIS.views.intialView;
//g3 = showClickableView(storyGIS.views.bip)

d3.select(window).on('resize', resize);

function resize() {
    
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

var mapNYCRegionUrl = "./gis/NYC_region_land_4326.geojson";
var mapShorelineUrl = "./gis/georeferenced_1775_shoreline_2_vector_4326.geojson";
var mapIndianVillagesUrl = "./gis/Indian_villages_ponds_paths_kings_cty_4326.geojson";
var storyURL = "./data/fbip-story.json";
var projection;

const margin = ({ top: 10, right: 0, bottom: 0, left: 10 });
const mapWidth = 640 - margin.left - margin.right;
const mapHeight = 640 - margin.top - margin.bottom;

var svg = d3.select("#story-container").append("svg")
    .attr('width', mapWidth + margin.left + margin.right)
    .attr('height', mapHeight + margin.top + margin.bottom)
    .attr("viewbox", [0, 0, mapHeight, mapHeight])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

function showMap(url, className){
    d3.json(url).then(function(geoJsonData) {

        console.log(geoJsonData);

        if (!projection){
            //If no projection has been created, use the projection for this map and fitSize, so it fills the screen
            projection = d3.geoAlbers()
                .rotate([74, 0]) //Rotate the projection
                .fitSize([mapWidth, mapHeight], geoJsonData);
        }

        var path = d3.geoPath()
            .projection(projection);

        var g = svg.append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
            .classed("map", true);

        if (className)
            g.classed(className, true);

        g.selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "grey");

        return {
            g: g,
            projection: projection
        };

    });
};
g0 = showMap(mapNYCRegionUrl, "nyc-region");
g1 = showMap(mapShorelineUrl, "shoreline");
g2 = showMap(mapIndianVillagesUrl, "indian-trails");

 d3.json(storyURL).then(function(story) {

    console.log(story);

    // var eraDivs = d3.select("#story-controller").selectAll("div")
    //         .data(story.timeline.eras)
    //         .enter()
    //         .append("div")
    //         .classed("era", true);

    // var labels = eraDivs.append("p")
    //     .text(d => d.name);


    var margin = {top: 20, right: 20, bottom: 30, left: 40}
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;


    var svg = d3.select("#story-controller").append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 960 100");
        
    var g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    var eraGroups = g.selectAll("g")
        .data(story.timeline.eras)
        .enter()
        .append("g")
        .attr("transform", (d, i) => "translate(" + (50 + i * 100) + ",0)");

    var circles = eraGroups.append("circle")
        .attr("cx", 0)
        .attr("cy", 10)
        .attr("r", 5)
        .style("stroke", "green")
        .style("fill", "none");

    var labels = eraGroups.append("text")
        .attr("y", -50)
        .text(d => d.name);

});
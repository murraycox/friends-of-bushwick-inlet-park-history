var mapNYCRegionUrl = "./gis/NYC_region_land_4326.geojson";
var mapShorelineUrl = "./gis/georeferenced_1775_shoreline_2_vector_4326.geojson";
var mapIndianVillagesUrl = "./gis/Indian_villages_ponds_paths_kings_cty_4326.geojson";
var storyURL = "./data/fbip-story.json";
var projection;

const margin = ({ top: 10, right: 0, bottom: 0, left: 10 });
const mapWidth = 640 - margin.left - margin.right;
const mapHeight = 640 - margin.top - margin.bottom;

const svg = d3.select("#story-container").append("svg")
    .attr('width', mapWidth + margin.left + margin.right)
    .attr('height', mapHeight + margin.top + margin.bottom)
    .attr("viewbox", [0, 0, mapHeight, mapHeight])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

const transformEnd = "translate(-73.963746815, 40.71768943) scale(1.5)"
const interpolatorTransform = d3.interpolateTransformSvg("translate(0, 0) scale(1)", transformEnd);

let transformStr = interpolatorTransform(0);

const g = svg.append("g")
    //.attr("transform", `translate(${margin.left}, ${margin.top})`)
    .attr("transform", transformStr);

function setProjection(fitSizeRect){

    projection = d3.geoAlbers()
        .rotate([74, 0]) //Rotate the projection
        .fitSize([mapWidth, mapHeight], fitSizeRect);

};

function showMap(url, className){
    d3.json(url).then(function(geoJsonData) {

        console.log(geoJsonData);

        var path = d3.geoPath()
            .projection(projection);

        var gMap = g.insert('g', ":first-child") //make sure it doesn't cover anything 
            .classed("map", true);

        if (className)
            gMap.classed(className, true);

        gMap.selectAll("path")
            .data(geoJsonData.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "grey");

        return {
            g: gMap,
            projection: projection
        };

    });
};

function getGeoJsonRect(nwLng, nwLat, seLng, seLat){
    
    const geoJsonRect = {
        "type": "FeatureCollection",
        "features": [
            {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "coordinates":[[[nwLng,nwLat],[seLng,nwLat],[seLng,seLat],[nwLng,seLat],[nwLng,nwLat]]],
                "type": "Polygon"
            }
            }
        ]
    };
    return geoJsonRect;
}
function showRect(nwLng, nwLat, seLng, seLat){

    const rectGeoJson = getGeoJsonRect(nwLng, nwLat, seLng, seLat);
      console.log(rectGeoJson)

      var path = d3.geoPath()
      .projection(projection);

    var gRect = g.append("g")
        .classed("story-rect", true);

    const pathRect = gRect.selectAll("path")
        .data(rectGeoJson.features)
        .enter()
        .append("path")
        .attr("d", path);

    const centerRect = path.centroid(rectGeoJson);
    const boundsRect = path.bounds(rectGeoJson);
    
    const padding = 10;

    const end = [centerRect[0], centerRect[1], boundsRect[1][1] + padding - boundsRect[0][1] + padding];

    const k = Math.min(mapWidth, mapHeight) / end[2];

    const translate = [mapWidth / 2 - end[0] * k, mapHeight / 2 - end[1] * k]

    const transformEnd = `translate(${translate}) scale(${k})`

    const interpolatorTransform = d3.interpolateTransformSvg("translate(0, 0) scale(1)", transformEnd)

    pathRect.on('click', function(){ 

        const duration = 1000 //interpolatorTransform.duration;
        let startTime;
        let frame;
        let transformStr = interpolatorTransform(0);
        
        // g.call(transition);
    
    
        // function transition(view) {
        //     view
        //         .transition()
        //         .delay(2000)
        //         .duration(duration)
        //         .attrTween("transform", interpolatorTransform);
        //         //.on("end", () => transition(view));
        // }


        function tick(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const t2 = elapsed / duration;
          
          if (elapsed < duration) {
            transformStr = interpolatorTransform(t2);
      
            g.attr("transform", transformStr);
            
            frame = requestAnimationFrame(tick);
          }
        };
      
        requestAnimationFrame(tick);  
        //invalidation.then(() => cancelAnimationFrame(frame));
            
        //g.attr("transform", interpolatorTransform(1));

    });

    return {
        g: gRect,
        projection: projection
    };

};

setProjection(getGeoJsonRect(-74.02156685, 40.75641487, -73.90592678, 40.67896399));
g0 = showMap(mapNYCRegionUrl, "nyc-region");
g1 = showMap(mapShorelineUrl, "shoreline");
g2 = showMap(mapIndianVillagesUrl, "indian-trails");

g3 = showRect(-73.96997894, 40.73141617, -73.94609275, 40.71686388)



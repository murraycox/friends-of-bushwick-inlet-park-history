<script lang="ts">
    
    import { createEventDispatcher } from 'svelte';
    import { geoAlbers } from  "d3";

    import Map from "$lib/components/Map.svelte"

    const dispatch = createEventDispatcher();

    function getGeoJsonRect(extent: {nwLng: number, nwLat: number, seLng: number, seLat: number}): any{
        
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
    };

    const projection = geoAlbers()
        .rotate([74, 0]) //Rotate the projection
        .fitSize([800, 600], getGeoJsonRect(
            {
                    nwLng: -73.97,
                    nwLat: 40.735,
                    seLng: -73.94,
                    seLat: 40.700
            }
        ));

    function onFeatureMouseOver(event) {
        console.log("Maps:onFeatureMouseOver(event.detail:" + JSON.stringify(event.detail));

        // TODO, add info about which map?
        dispatch('featureMouseOver', event);
    }

</script>

<div id="map">
    <svg id="map-svg">
        <Map url="/gis/NYC_region_land_4326.geojson" projection={projection} id="map-nyc-region-land"/>
        <Map url="/gis/1776_shoreline_polylines_4326.geojson" projection={projection} id="map-era-1-shorelines"/>
        <Map url="/gis/era_3_1855-1950s_story_polys_sorted.geojson" projection={projection} id="map-era-3-story"on:featureMouseOver={onFeatureMouseOver}/>
    </svg>
</div>


<style>

    #map, #map-svg {
        position: absolute;
        width: 100%;
        height: 100%
    }

</style>
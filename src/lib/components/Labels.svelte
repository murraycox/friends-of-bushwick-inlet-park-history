<script>

    import { onMount } from 'svelte';
    import { json, geoPath } from  "d3";
    import { base } from '$app/paths';

    export let path;
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let interactive = false; //whether to track mouse events like mouseenter, mouseout and mousemove
    export let visible = false;
    export let filterOnContext = false;
    export let activeViewID;
    export let activeEraID;
    export let activeStopID;
    export let labelField = "label";

    let dataset = [];

    onMount(() => {
        console.log(`Labels:onMount(id:${id})`);
        json(base + path).then((geoJsonData) => {

            dataset = geoJsonData.features;
            path = geoPath()
                .projection(projection);

        });
    });

</script>

<g class="map-svg-g {`view-${activeViewID}`} {`era-${activeEraID}`} {`stop-${activeStopID}`}" class:visible={visible} class:hidden={!visible} id={id} class:interactive={interactive}>
{#each dataset as data}
    <!-- some geometries in the shapefile are none? -->
    {#if (data.geometry && (!filterOnContext || data.properties.era == activeEraID))}
        <text
            class="text-background"
            transform={`translate(${projection(data.geometry.coordinates)})`}
            dy=".35em"
        >
            {data.properties[labelField]}
        </text>
        <text
            transform={`translate(${projection(data.geometry.coordinates)})`}
            dy=".35em"
        >
            {data.properties[labelField]}
        </text>
    {/if}
{/each}
</g>


<style>

    .map-svg-g.visible text{
        visibility: visible;
        opacity: 1;
        transition: opacity 4s linear;
    }

    .map-svg-g.hidden text {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 4s, opacity 4s linear;
    }

    .map-svg-g.interactive text {
        cursor: pointer;
    }

    text {
        fill: #343434;
        fill-opacity: .8;
        font-size: 8px;
        font-weight: 500;
        text-anchor: middle;
    }

    /* We might be able to build scaling the stroke-width into the map zoom, but for now we will use styles */
    /* .stop-when-it-is-completed and 50-kent-st */
    #fbip-labels.stop-when-it-is-completed text,
    #fbip-labels.stop-50-kent-st text
    {
        font-size: 2px;
    }

    #fbip-labels.era-pre-1600s text
    {
        font-size: 6px;
    }

    #era-1-labels text.text-background
    {
        fill: white; /* TODO convert this to a variable */
        font-size: 24px;
        font-weight: 800;

    }

    #era-1-labels text
    {
        fill: #5199C7; /* TODO convert this to a variable */
        font-size: 22px;
        font-weight: 800;

    }

</style>
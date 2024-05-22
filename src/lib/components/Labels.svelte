<script>

    import { onMount } from 'svelte';
    import { json, geoPath } from  "d3";
    import { base } from '$app/paths';

    export let path;
    export let projection; //get the overall projection from the Maps component?
    export let id;
    export let interactive = false; //whether to track mouse events like mouseenter, mouseout and mousemove
    export let visible = false;

    let dataset = [];

    onMount(() => {
        json(base + path).then((geoJsonData) => {

            dataset = geoJsonData.features;
            path = geoPath()
                .projection(projection);

        });
    });

</script>

<g class="map-svg-g" class:visible={visible} class:hidden={!visible} id={id}>
{#each dataset as data}
        <text
            transform={`translate(${projection(data.geometry.coordinates)})`}
            dy=".35em"
        >
            {data.properties.label}
        </text>

{/each}
</g>


<style>

    text {
        fill: #1d1d1d;
        fill-opacity: .8;
        font-size: 8px;
        font-weight: 300;
        text-anchor: middle;
    }

</style>
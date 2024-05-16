<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";
    import { tile } from "d3-tile";

    export let urlPath;
    export let urlExtension;
    export let projection; //get the overall projection from the Maps component?
    export let visible = false;

    const dispatch = createEventDispatcher();

    onMount(() => {
    });

    // const _tile = tile();

    // const tiles = _tile({k: 256, x: 480, y: 250});

    const _tile = tile()
        .size([2000, 1000])
        //See this excellent post why we need to alter the scale: https://stackoverflow.com/a/34185322
        .scale(projection.scale() * 2 * Math.PI)
        .translate(projection([0, 0]));

    const tiles = _tile();
    
    const {translate: [tx, ty], scale: k} = tiles;
    const url = (x, y, z) => `${urlPath}${z}/${x}/${y}.${urlExtension}`;

    function position(tile, tiles) {
        const [x, y] = tile;
        const {translate: [tx, ty], scale: k} = tiles;
        return [(x + tx) * k, (y + ty) * k];
    };

</script>

<g class="map-svg-g" class:visible={visible}>
    {#each tiles as tile}
        {@const [x, y] = position(tile, tiles)}
        <image xlink:href={url(...tile)} x={x} y={y} width={k} height={k}/>
    {/each}
</g>


<style>

    .map-svg-g image {
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s 4s, opacity 4s linear;
    }

    .map-svg-g.visible image{
        visibility: visible;
        opacity: 0.2;
        transition: opacity 4s linear;
    }

</style>
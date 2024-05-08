<script>

    import { onMount, createEventDispatcher } from 'svelte';
    import { json, geoAlbers, geoPath } from  "d3";
    import { tile } from "d3-tile";

    export let projection; //get the overall projection from the Maps component?

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
    console.log(`tx:${tx}, ty:${ty}, k:${k}`);

    for (const [x, y, z] of tiles) {
        console.log(`tile ${x}/${y}/${z} is at ${(x + tx) * k}, ${(y + ty) * k}`);
    }

    const url = (x, y, z) => `/gis/pluto/${z}/${x}/${y}.png`

    function position(tile, tiles) {
        const [x, y] = tile;
        const {translate: [tx, ty], scale: k} = tiles;
        return [(x + tx) * k, (y + ty) * k];
    }

</script>

<g class="map-svg-g">
    {#each tiles as tile}
        {@const [x, y] = position(tile, tiles)}
        <image xlink:href={url(...tile)} x={x} y={y} width={k} height={k}/>
    {/each}
</g>


<style>

    image{
      opacity: 0.4;
    }

</style>
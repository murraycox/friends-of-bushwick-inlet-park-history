<script>
	import { page } from '$app/stores';
    import NavEras from "$lib/components/NavEras.svelte";
    import NavTimeline from "$lib/components/NavTimeline.svelte";
	
    import story from '$lib/data/story.json';
	import styles from '$lib/styles.js';

	export let data; //Get data from +page.server.js

</script>

<NavEras 
    navigateWithinMap={false} 
    activeEraID={$page.params.era}
/>         
<div 
	id="story-container" class={`era-${$page.params.era}`} 
	style="--color-era-urban-industrial: {styles.colorEraUrbanIndustrial}; --color-era-pre-1600s: {styles.colorEraPre1600s}; --color-era-early-european-settlement: {styles.colorEraEarlyEuropeanSettlement}"
>
    <div id="story-narrative">
        <div id="story-context-container">
            <div id="era-short-label">
                {data.chapter.era.name}
            </div>
            <h1>{data.chapter.name}</h1>
        </div>
        {@html data.chapter.content}
    </div>
    <div class="story-narrative-footer"></div>
</div>
<NavTimeline 
    eras={story.eras} 
    navigateWithinMap={false}
    activeEraID={$page.params.era}
/>

<style>

    #story-narrative-content, #story-controller, #story-narrative {
    font-family: 'Public Sans', sans-serif;
    }

    .story-narrative-footer {
        margin-top: 360px;
        height: 500px;
        width: 100%;
        /* background-image: url("../images/brick_pattern_2.svg"); */
        /* background-size: 10px 10px; */
        /* background-size: contain; */
        background-color: gray;
        -webkit-mask-image: url("/images/brick_pattern_2.svg");
        -webkit-mask-size: 10px 10px;
        mask-image: url("/images/brick_pattern_2.svg");
        mask-size: 10px 10px;
    }

	.era-urban-industrial .story-narrative-footer {
		background-color: var(--color-era-urban-industrial)
    }	

	.era-pre-1600s .story-narrative-footer {
        -webkit-mask-image: url("/images/water_pattern.svg");
        -webkit-mask-size: 100px 100px;
        mask-image: url("/images/water_pattern.svg");
        mask-size: 100px 100px;
		background-color: var(--color-era-pre-1600s)
    }	

    .era-early-european-settlement .story-narrative-footer {
        -webkit-mask-image: url("/images/wetlands_pattern.svg");
        -webkit-mask-size: 60px 46px;
        mask-image: url("/images/wetlands_pattern.svg");
        mask-size: 60px 46px;
        background-color: var(--color-era-early-european-settlement) 
    }

    #story-narrative {
    font-size: 20px;
    }

    #story-narrative :global(h2) {
    color: #4E4E4E;
    }

    #story-narrative :global(h1) {
    font-size: 2em;
    font-weight: 600;
    }

    #story-context-container {
        margin-top: 35px;
        margin-bottom: 30px;
    }

    #story-context-container h1 {
        display: inline-block;
    }

    #story-context-container #era-short-label {
        display: inline-block;
        font-size: 1.1em;
        font-weight: 600;
    }

    #story-context-container #era-short-label {
        background-color: lightgrey;
        color: white;
        border-radius: 50px;
        padding: 0 10px;
        margin-right: 10px;
    }

	.era-pre-1600s #story-narrative :global(h1) {
		color: var(--color-era-pre-1600s)
    }

    .era-pre-1600s #era-short-label {
        background-color: var(--color-era-pre-1600s) !important;
    }

	.era-urban-industrial #story-narrative :global(h1) {
		color: var(--color-era-urban-industrial)
    }

    .era-urban-industrial #era-short-label {
        background-color: var(--color-era-urban-industrial) !important;
    }

    #story-narrative :global(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin-block-start: 85px;
    margin-block-end: 30px;
    }


    #story-narrative :global(p) {
    margin: 0 10%;
    font-size: 1em;
    line-height: 1.5em;
    font-weight: 100;
    margin-block-start: 0.75em;
    margin-block-end: 2em;
    color: #212121;
    }

    .text-padding-right{
        padding-right: 10%;
    }

    .images-container-side-by-side {
    width: 100%;
    display: flex;
    flex-direction: row;
    }

    .image-container-side-by-side {
    margin: 5px;
    }


    #story-narrative :global(.figure) {
    padding-bottom: 200px;
    }
    
	/* let's define these for all images so we don't need to add bootstrap classes like img-fluid and text-center */
    #story-narrative :global(.figure-caption) {
        text-align: left!important;
        color: black;
        font-size: .7em;
    }

    #story-narrative :global(.figure-img) {
        max-width: 100%;
        height: auto;
    }

    /* Mobile first positioning */

    #story-container {
        padding-top: 52px;
    }

    #story-narrative {
        margin: 0 15px;
    }

    /* Breakpoints at 576px, 768px, 992px, and 1200px (Bootstrap). */

    @media (min-width: 768px){

        #story-container {
            padding-top: 0;
        }

        #story-narrative {
            margin: 0 124px 0 124px;
        }   

    }


    @media (min-width: 1200px){

        #story-narrative {
            width: 900px;
            margin: 0 auto;
    }

}


</style>

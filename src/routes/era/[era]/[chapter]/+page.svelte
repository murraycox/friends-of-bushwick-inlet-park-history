<script lang="ts">
	import { page } from '$app/stores';
    
    import { base } from '$app/paths';

    import NavEras from "$lib/components/NavEras.svelte";
    import NavTimeline from "$lib/components/NavTimeline.svelte";
	
    import story from '$lib/data/story.json';
	import styles from '$lib/styles.js';

    let { data } = $props();

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
        {#if data.chapter.headlineImage }
            <figure class="figure">
                <img src="{data.chapter.headlineImage.url}" class="figure-img" alt="{data.chapter.headlineImage.title}">
                <figcaption class="figure-caption">{data.chapter.headlineImage.description}</figcaption>
            </figure>
        {/if}
        <div id="content-container">
            {@html data.chapter.content}
        </div>
        <div id="story-footer-navigation">
            <div id="story-footer-navigation-back">
                <a href="{(base) + (data.lastChapter ? data.lastChapter.link : '/')}">
                    <div id="story-footer-navigation-back-button" class="story-footer-navigation-button">
                        <div id="button-left"></div>
                        {data.lastChapter ? data.lastChapter.name : "back to era map"}
                    </div>
                </a>
            </div>
            <div id="story-footer-navigation-next">
                <a href="{(base) + (data.nextChapter ? data.nextChapter.link : '/')}">
                    <div id="story-footer-navigation-next-button" class="story-footer-navigation-button">{data.nextChapter ? data.nextChapter.name : "back to next era map"}<div id="button-right"></div></div>
                    <!-- <div id="story-footer-navigation-next-button" class="story-footer-navigation-button">Next chapter or back to next era map</div> -->
                </a>
            </div>
        </div>
    </div>
    <div class="story-narrative-footer"></div>
</div>
<NavTimeline 
    eras={story.eras} 
    navigateWithinMap={false}
    activeEraID={$page.params.era}
/>

<style>

    #story-footer-navigation {
        margin-top: 360px;
        font-size: .7em;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #story-footer-navigation a {
        text-decoration: none;
    }

    #story-footer-navigation-next {
        /* push this div to the right in the parent flexbox */
        justify-content: flex-end;
        margin-left: auto;
        /* this is also a flexbox */
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }

    #story-footer-navigation-next-label {
        margin-right: 10px;
    }

    .story-footer-navigation-button {
        background-color: grey;
        color: white;
        border-radius: 99px; /* large border to make ends round */
        padding: 0 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    #button-left {
        height: 24px;
        width: 22px;
        background-image: url($lib/images/icons/left.svg);
        margin: 5px 10px 5px 0;
    }

    #button-right {
        height: 24px;
        width: 26px;
        background-image: url($lib/images/icons/right.svg);
        margin: 5px 0 5px 10px;
    }

    #story-narrative-content, #story-controller, #story-narrative {
    font-family: 'Public Sans', sans-serif;
    }

    .story-narrative-footer {
        margin-top: 80px;
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
        line-height: 1;
    }

    #story-context-container #era-short-label {
        line-height: 1;
        font-size: 0.8em;
    }

	.era-pre-1600s #story-narrative #story-context-container, .era-pre-1600s #story-narrative :global(h1) {
		color: var(--color-era-pre-1600s);
    }

    .era-pre-1600s .story-footer-navigation-button {
        background-color: var(--color-era-pre-1600s);
    }

	.era-early-european-settlement #story-narrative #story-context-container, .era-early-european-settlement #story-narrative :global(h1) {
		color: var(--color-era-early-european-settlement);
    }

    .era-early-european-settlement .story-footer-navigation-button {
        background-color: var(--color-era-early-european-settlement);
    }

	.era-urban-industrial #story-narrative #story-context-container, .era-urban-industrial #story-narrative :global(h1) {
		color: var(--color-era-urban-industrial);
    }

    .era-urban-industrial .story-footer-navigation-button {
        background-color: var(--color-era-urban-industrial);
    }

    #story-narrative :global(h2) {
    font-size: 1.5em;
    font-weight: 600;
    margin-block-start: 85px;
    margin-block-end: 30px;
    }

    #story-narrative #content-container {
        margin: 0 5%;
    }

    #story-narrative :global(p) {
    font-size: 1em;
    line-height: 1.5em;
    font-weight: 100;
    margin-block-start: 0.75em;
    margin-block-end: 2em;
    color: #212121;
    margin: 0 5%;
    }

    .text-padding-right{
        padding-right: 10%;
    }

    #story-narrative :global(.figure) {
        padding-bottom: 80px;
    }

    #story-narrative #content-container :global(.figure) {
        padding-top: 80px;
    }
    
	/* let's define these for all images so we don't need to add bootstrap classes like img-fluid and text-center */
    #story-narrative :global(.figure-caption) {
        text-align: left!important;
        color: black;
        font-size: .7em;
        font-weight: 200;
    }

    #story-narrative :global(.figure-img) {
        max-width: 100%;
        height: auto;
    }

    #story-narrative :global(.side-by-side-image){
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    #story-narrative #content-container :global(.side-by-side-image .figure) {
        padding-top: 0;
    }

    #story-narrative #content-container :global(.side-by-side-image .figure:first-child) {
        padding-top: 80px;
    }

    #story-narrative :global(.side-by-side-image .figure) {
        width: 100%;
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
        
        #story-narrative :global(.side-by-side-image) {
            flex-direction: row;
        }

        #story-narrative :global(.side-by-side-image .figure) {
            margin-left: 5px;
            margin-right: 5px;
        }

        #story-narrative :global(.side-by-side-image .figure:first-child) {
            margin-left: 0;
        }

        #story-narrative #content-container :global(.side-by-side-image) {
            padding-top: 80px;
        }

        #story-narrative #content-container :global(.side-by-side-image .figure:first-child) {
            padding-top: 0;
        }

        #story-narrative :global(.side-by-side-image .figure:last-child) {
            margin-right: 0;
        }

    }


    @media (min-width: 1200px){

        #story-narrative {
            width: 900px;
            margin: 0 auto;
        }

    }


</style>

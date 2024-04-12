<script>

    import { page } from '$app/stores';

    import NavEras from "$lib/components/NavEras.svelte";
    
    const eraMatch = $page.url.pathname.match(/\/eras\/(\w+-\w+)\/*/);
    const eraClass = eraMatch?eraMatch[0]:"era-unknown";

</script>

<NavEras />         
<div id="story-container" class={eraClass}>
    <div id="story-narrative">
        <slot></slot>
    </div>
    <div class="story-narrative-footer"></div>
</div>
<div id="story-controller" class="position-fixed">
    <div id="story-controller-timeline-era-titles">
    </div>
    <div id="story-controller-timeline">
    </div>
</div>

<style>
    #story-narrative-content, #story-controller, #story-narrative {
    font-family: 'Public Sans', sans-serif;
    }

    :global(.story-narrative-footer) {
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

    #story-narrative {
    font-size: 20px;
    }

    #story-narrative :global(h2) {
    color: #4E4E4E;
    }

    #story-narrative :global(h1) {
    font-size: 2em;
    font-weight: 600;
    margin-block-start: 44px;
    margin-block-end: 30px;
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

    :global(.text-padding-right){
        padding-right: 10%;
    }

    :global(.images-container-side-by-side) {
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
    :global(.figure-caption) {
        text-align: left!important;
        color: black;
        font-size: .7em;
    }

    :global(.figure-img) {
        max-width: 100%;
        height: auto;
    }

    /* Mobile first positioning */

    #story-narrative {
        margin: 0 84px 0 84px;
    }

    /* Breakpoints at 576px, 768px, 992px, and 1200px (Bootstrap). */

    @media (min-width: 768px){
          
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
<script>
    import { page } from '$app/stores';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    
    function onViewClick(id){
        console.log(`NavEras:onViewClick(${id})`);
        //Tell the page to change view
        dispatch('navigate', {
            viewID: id,
            eraID: null
		});
    };
    
    function onEraClick(id){
        console.log(`NavEras:onEraClick(${id})`);
        //Tell the page to change view
        dispatch('navigate', {
            viewID: id, //TODO lookup the view, don't assume they're the same?
            eraID: id
		});
    };

</script>

<div id="story-navigation" class="position-fixed">
    <a href="#" on:click={() => onViewClick("intro")}>
        <div class="story-navigation-button">
            Intro
        </div>
    </a>
    <a href="#" on:click={() => onEraClick("pre-1600s")}>
        <div class="story-navigation-button-and-label era-pre-colonial"  class:active={$page.url.pathname.includes("/eras/pre-colonial")}>
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                <span>pre 1600s</span>
            </div>
        </div>
    </a>
    <a href="#" on:click={() => onEraClick("early-european-settlement")}>
        <div class="story-navigation-button-and-label era-early-european-settlement">
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                <span>1620-1855</span>
            </div>
        </div>
    </a>
    <a href="#" on:click={() => onEraClick("urban-industrial-era")}>
        <div class="story-navigation-button-and-label era-urban-industrial" class:active={$page.url.pathname.includes("/eras/urban-industrial")}>
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                <span>1855-1950</span>
            </div>
        </div>
    </a>
    <div class="story-navigation-button-and-label era-migration">
        <div class="story-navigation-button">
        </div>
        <div class="story-navigation-label">
            <span>1950-2005</span>
        </div>
    </div>
    <div class="story-navigation-button-and-label era-activism-deindustrialization">
        <div class="story-navigation-button">
        </div>
        <div class="story-navigation-label">
            <span>2005-Future</span>
        </div>
    </div>
</div>  

<style>

    #story-navigation a {
        text-decoration: none;
    }

    .story-navigation-button-and-label{
        display: flex;
        flex-direction: row;
    }

    .story-navigation-button {
        background-color: white;
        border: 1px solid lightgrey;
    }

    /* Styles for .era-pre-colonial */
    .story-navigation-button-and-label.era-pre-colonial .story-navigation-button {
        background-image: url("/images/icons/era1_icon_5199C7.svg");
        border-color: #5199C7;
    }
    .story-navigation-button-and-label.era-pre-colonial:hover .story-navigation-button {
        background-image: url("/images/icons/era1_icon_5199C7_inverted.svg");
    }

    .story-navigation-button-and-label.era-pre-colonial, .story-navigation-button-and-label.era-pre-colonial:hover .story-navigation-button, .story-navigation-button-and-label.era-pre-colonial.active .story-navigation-button, body.era-pre-colonial .story-narrative-footer {
        background-color: #5199C7;
    }

    /* Styles for .era-early-european-settlement */
    .story-navigation-button-and-label.era-early-european-settlement .story-navigation-button {
        background-image: url("/images/icons/era2_icon_70AC00.svg");
        border-color: #70AC00;
    }
    .story-navigation-button-and-label.era-early-european-settlement:hover .story-navigation-button {
        background-image: url("/images/icons/era2_icon_70AC00_inverted.svg");
    }

    .story-navigation-button-and-label.era-early-european-settlement, .story-navigation-button-and-label.era-early-european-settlement:hover .story-navigation-button {
        background-color: #70AC00;
    }

    /* Styles for .era-urban-industrial */
    .story-navigation-button-and-label.era-urban-industrial .story-navigation-button {
        background-image: url("/images/icons/era3_icon_9762AF.svg");
        border-color: #9762AF;
    }
    .story-navigation-button-and-label.era-urban-industrial:hover .story-navigation-button {
        background-image: url("/images/icons/era3_icon_9762AF_inverted.svg");
    }

    .story-navigation-button-and-label.era-urban-industrial, .story-navigation-button-and-label.era-urban-industrial:hover .story-navigation-button, .story-navigation-button-and-label.era-urban-industrial.active .story-navigation-button, body.era-urban-industrial .story-narrative-footer {
        background-color: #9762AF;
    }
    
    /* Styles for .era-migration */
    .story-navigation-button-and-label.era-migration .story-navigation-button {
        background-image: url("/images/icons/era4_icon_D0B000.svg");
        border-color: #D0B000;
    }
    .story-navigation-button-and-label.era-migration:hover .story-navigation-button {
        background-image: url("/images/icons/era4_icon_D0B000_inverted.svg");
    }

    .story-navigation-button-and-label.era-migration, .story-navigation-button-and-label.era-migration:hover .story-navigation-button {
        background-color: #D0B000;
    }

    /* Styles for .era-activism-deindustrialization */
    .story-navigation-button-and-label.era-activism-deindustrialization .story-navigation-button {
        background-image: url("/images/icons/era5_icon_E36900.svg");
        border-color: #E36900;
    }
    .story-navigation-button-and-label.era-activism-deindustrialization:hover .story-navigation-button {
        background-image: url("/images/icons/era5_icon_E36900_inverted.svg");
    }

    .story-navigation-button-and-label.era-activism-deindustrialization, .story-navigation-button-and-label.era-activism-deindustrialization:hover .story-navigation-button {
        background-color: #E36900;
    }

    .story-navigation-button img {
        width: 50px;
        height: 50px;
    }

    /* Mobile first positioning */

    #story-navigation {
        top: 0;
        width: 100%;
        display: flex;
        flex-direction: row;
        z-index: 9999;
        background-color: white;
        padding: 5px 20px;
        border-bottom: 1px solid lightgray;
        opacity: 0.9;
    }

    .story-navigation-button-group {
        display: flex;
        line-height: 35px;
        cursor: pointer;
        text-align: center;
        font-size: 10px;
        font-weight: bold;
    }

    .story-navigation-button-and-label {
        /* display: block; */
        background-color: white;
        border-radius: 22.5px;
        width: fit-content;
        /* height: 35px; */
    }

    .story-navigation-button {
        background-color: white;
        border-radius: 50%;
        width: 35px;
        height: 35px;
        line-height: 35px;
        cursor: pointer;
        text-align: center;
        color: #8D8E8E;
        font-size: 10px;
        font-weight: bold;
        /* margin: 3px; */
    }

    .story-navigation-label{
        height: 35px;
        line-height: 35px;
        color: white;
        font-size: 10px;
        font-weight: bold;
        /* margin: 3px; */
    }

    .story-navigation-label{
        border-radius: 17.5px;
        height: 35px;
        width: 35px;
        padding: 0 10px;
    }

    /* may be able to animate this, but it's a bit hacky, e.g. this: https://stackoverflow.com/questions/3508605/how-can-i-transition-height-0-to-height-auto-using-css/8331169#8331169 */
    .story-navigation-label:hover {
        width: auto;
    }

    /* Mobile first */

    /* .story-navigation-button {
        margin-right: 3px;
    } */

    .story-navigation-button-and-label {
        margin: 0 3px;
    }

    .story-navigation-button {
        padding-right: 3px;
    }

    .story-navigation-button-group .story-navigation-button {
        display: block;
    }

    .story-navigation-label{
        display: none;
        border: none; 
        width: auto;
        margin-right: 15px;
    }

    .story-navigation-label span{
        display: inline;
    }

    .story-navigation-button-and-label:hover .story-navigation-label{
        display: block;
    }
    
    /* Breakpoints at 576px, 768px, 992px, and 1200px (Bootstrap). */

    @media (min-width: 576px){

    }

    @media (min-width: 768px){
  
        #story-navigation {
            left: 40px;
            top: 44px;
            width: fit-content;
            flex-direction: column;
            background-color: inherit;
            padding: 0;
            border-bottom: none;
        }

        .story-navigation-button-and-label {
            margin: 3px 0;
        }
        
    }
    
    @media (min-width: 1200px){

        #story-navigation {
            left: 80px;
        } 

    }

</style>
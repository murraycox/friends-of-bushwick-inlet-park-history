<script>

    import { createEventDispatcher } from 'svelte';
    
    import { page } from '$app/stores';
    import { base } from '$app/paths';

    import NavErasButton from "$lib/components/NavErasButton.svelte";

    export let navigateWithinMap = true;

    //exported "method" called by parent
    export function navigate(event){
        console.log(`NavEras:navigate(event:${JSON.stringify(event.detail)})`);
        //Updating the current view should automatically change the visibility of the maps?
        activeViewID = event.detail.viewID;
        activeEraID = event.detail.eraID;
        //activeStopID = null; //until we move through the story
    };

    let activeViewID = "intro";
    let activeEraID = null;
    let activeStopID = null;

    const dispatch = createEventDispatcher();
    


    //dispatch function called by children
    function onNavigate(event) {
        console.log(`NavEras:onNavigate(event: ${JSON.stringify(event)}`);

        //Tell the page to change view
        if (navigateWithinMap) {
            dispatch('navigate', event.detail);
        }
    };

</script>

<div id="story-navigation" class="position-fixed">
    <NavErasButton
        viewID="intro"
        buttonText="Intro"
        on:navigate={onNavigate}
    />
    <NavErasButton
        eraID="pre-1600s"
        active={activeEraID=="pre-1600s"}
        labelText="pre 1600s"
        on:navigate={onNavigate}
    />
    <NavErasButton
        eraID="early-european-settlement"
        active={activeEraID=="early-european-settlement"}
        labelText="1620-1855"
        on:navigate={onNavigate}
    />
    <NavErasButton
        eraID="urban-industrial"
        active={activeEraID=="urban-industrial"}
        labelText="1855-1950"
        on:navigate={onNavigate}
    />
    <NavErasButton
        eraID="migration"
        labelText="1950-2005"
        on:navigate={onNavigate}
    />
    <NavErasButton
        eraID="activism-deindustrialization"
        labelText="2005-Future"
        on:navigate={onNavigate}
    />
</div>  

<style>


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

    /* Mobile first */
    
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

    }
    
    @media (min-width: 1200px){

        #story-navigation {
            left: 80px;
        } 

    }

</style>
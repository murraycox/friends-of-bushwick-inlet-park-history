<script>

    import { createEventDispatcher } from 'svelte';

    import { base } from '$app/paths';

    export let navigateToMap = null;
    export let navigateToPage = null;
    export let viewID = null;
    export let eraID = null;
    export let buttonText = null;
    export let labelText = null;
    export let active = false;

    let hover = false;

    const dispatch = createEventDispatcher();

    function onClick(e){
        console.log(`NavErasButton:onClick()`);
        console.log(`NavErasButton:onClick(e.pointerType: ${e.pointerType})`);
        if ((!labelText) || (e.pointerType == "mouse") ||  ((e.pointerType != "mouse") && hover)) {
            console.log(`NavErasButton:dispatch: navigate, viewID: ${viewID}, eraID: ${eraID}`);
            //Tell the Nav to change view. If an era is clicked, on navigate to that view
            dispatch('navigate', {
                viewID: viewID ? viewID : eraID,
                eraID: eraID
            });
        } else if ((e.pointerType != "mouse") && !hover) {
            hover = true;
        }


    };

    function onMouseLeave(){
        console.log(`NavErasButton:onMouseLeave()`);
        hover = false;
    };
  
</script>

    <a on:click={e => onClick(e)} on:mouseleave={onMouseLeave}>
        <div class="{`story-navigation-button-and-label era-${eraID}`}" class:hover={hover} class:active={active}>
            <div class="story-navigation-button">
                {#if buttonText }
                    {buttonText}
                {/if}
            </div>
            {#if labelText}
            <div class="story-navigation-label">
                <span>{labelText}</span>
            </div>            
            {/if}
        </div>
    </a>

<style>

    a {
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
    .era-pre-1600s .story-navigation-button {
        background-image: url($lib/images/icons/era1_icon_5199C7.svg);
        border-color: #5199C7;
    }
    .era-pre-1600s.active .story-navigation-button, .era-pre-1600s:hover .story-navigation-button {
        background-image: url($lib/images/icons/era1_icon_5199C7_inverted.svg);
    }

    .story-navigation-button-and-label.era-pre-1600s, .era-pre-1600s.active .story-navigation-button, .era-pre-1600s:hover .story-navigation-button {
        background-color: #5199C7;
    }

    /* Styles for .era-early-european-settlement */
    .era-early-european-settlement .story-navigation-button {
        background-image: url($lib/images/icons/era2_icon_70AC00.svg);
        border-color: #70AC00;
    }
    
    .era-early-european-settlement.active .story-navigation-button, .era-early-european-settlement:hover .story-navigation-button {
        background-image: url($lib/images/icons/era2_icon_70AC00_inverted.svg);
    }

    .story-navigation-button-and-label.era-early-european-settlement, .era-early-european-settlement.active .story-navigation-button, .era-early-european-settlement:hover .story-navigation-button {
        background-color: #70AC00;
    }
  
    /* Styles for .era-urban-industrial */
    .era-urban-industrial .story-navigation-button {
        background-image: url($lib/images/icons/era3_icon_9762AF.svg);
        border-color: #9762AF;
    }
    
    .era-urban-industrial.active .story-navigation-button, .era-urban-industrial:hover .story-navigation-button {
        background-image: url($lib/images/icons/era3_icon_9762AF_inverted.svg);
    }

    .story-navigation-button-and-label.era-urban-industrial, .era-urban-industrial.active .story-navigation-button, .era-urban-industrial:hover .story-navigation-button {
        background-color: #9762AF;
    }
    
    /* Styles for .era-migration */
    .era-deindustrialization .story-navigation-button {
        background-image: url($lib/images/icons/era4_icon_D0B000.svg);
        border-color: #D0B000;
    }
    
    .era-deindustrialization:hover .story-navigation-button {
        background-image: url($lib/images/icons/era4_icon_D0B000_inverted.svg);
    }

    .story-navigation-button-and-label.era-deindustrialization, .story-navigation-button-and-label.era-deindustrialization:hover .story-navigation-button {
        background-color: #D0B000;
    }

    /* Styles for .era-activism-deindustrialization */
    .era-the-future .story-navigation-button {
        background-image: url($lib/images/icons/era5_icon_E36900.svg);
        border-color: #E36900;
    }
    .era-the-future.active .story-navigation-button, .era-the-future:hover .story-navigation-button {
        background-image: url($lib/images/icons/era5_icon_E36900_inverted.svg);
    }

    .story-navigation-button-and-label.era-the-future, .era-the-future.active .story-navigation-button, .era-the-future:hover .story-navigation-button {
        background-color: #E36900;
    }

    .story-navigation-button img {
        width: 50px;
        height: 50px;
    }

    /* Mobile first positioning */

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

    .story-navigation-button-and-label:hover .story-navigation-label {
        display: block;
    }
    
    /* Breakpoints at 576px, 768px, 992px, and 1200px (Bootstrap). */

    @media (min-width: 576px){

    }

    @media (min-width: 768px){
  
        .story-navigation-button-and-label {
            margin: 3px 0;
        }
        
    }
    
    @media (min-width: 1200px){

    }


</style>

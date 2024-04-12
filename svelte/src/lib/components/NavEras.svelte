<script>
    import { page } from '$app/stores';
</script>

<div id="story-navigation" class="position-fixed">
    <div class="story-navigation-button-group">
        <div class="story-navigation-button-group-header">
            eras
        </div>
        <a href="/eras/pre-colonial">
            <div class="story-navigation-button-and-label era-pre-colonial"  class:active={$page.url.pathname.includes("/eras/pre-colonial")}>
                <div class="story-navigation-button">
                </div>
                <div class="story-navigation-label">
                    Pre Colonial
                </div>
            </div>
        </a>
        <div class="story-navigation-button-and-label era-early-european-settlement">
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                Early European Settlement
            </div>
        </div>
        <a href="/eras/urban-industrial">
            <div class="story-navigation-button-and-label era-urban-industrial" class:active={$page.url.pathname.includes("/eras/urban-industrial")}>
                <div class="story-navigation-button">
                </div>
                <div class="story-navigation-label">
                    Urban + Industrial Era
                </div>
            </div>
        </a>
        <div class="story-navigation-button-and-label era-migration">
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                Migration
            </div>
        </div>
        <div class="story-navigation-button-and-label era-activism-deindustrialization">
            <div class="story-navigation-button">
            </div>
            <div class="story-navigation-label">
                Activism + Deindustrialization
            </div>
        </div>
    </div>
</div>  

<style>

    #story-navigation {
        top: 44px;
        display: flex;
        flex-direction: column;
        z-index: 99;
    }

    #story-navigation a {
        text-decoration: none;
    }

    .story-navigation-button-group {
        background-color: white;
        border: #8D8E8E 1px solid;
        border-radius: 22.5px;
        width: max-content;
        /* width: 43px; */
        /* height: 35px; */
        line-height: 35px;
        cursor: pointer;
        text-align: center;
        font-size: 10px;
        font-weight: bold;
    }

    .story-navigation-button-group-header {
        text-align: left;
        margin: 5px 10px;
        line-height: 10px;
        }

        .story-navigation-button-and-label{
        display: flex;
        flex-direction: row;
        }

        .story-navigation-label{
        display: none;
        }

        .story-navigation-button-group:hover .story-navigation-label{
        display: block;
        }

    .story-navigation-label{
        height: 35px;
        line-height: 35px;
        color: #8D8E8E;
        font-size: 10px;
        font-weight: bold;
        margin: 3px;
        margin-right: 15px;
    }

    .story-navigation-button {
        border: #8D8E8E 1px solid;
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
        margin: 3px;
    }

    .story-navigation-button-and-label .story-navigation-button {
        background-color: lightgray;
    }
    .story-navigation-button-and-label .story-navigation-label{
        color: gray;
    }

    /* Styles for .era-urban-industrial */
    .story-navigation-button-and-label.era-urban-industrial:hover .story-navigation-button, .story-navigation-button-and-label.era-urban-industrial.active .story-navigation-button, body.era-urban-industrial .story-narrative-footer {
        background-color: #A060C1;
    }
    .story-navigation-button-and-label.era-urban-industrial:hover .story-navigation-label, .story-navigation-button-and-label.era-urban-industrial.active .story-navigation-label, body.era-urban-industrial #story-narrative h1{
        color: #A060C1;;
    }

    /* Styles for .era-early-european-settlement */
    .story-navigation-button-and-label.era-early-european-settlement:hover .story-navigation-button {
        background-color: #83BC6E;
    }
    .story-navigation-button-and-label.era-early-european-settlement:hover .story-navigation-label{
        color: #83BC6E;
    }

    /* Styles for .era-pre-colonial */
    .story-navigation-button-and-label.era-pre-colonial:hover .story-navigation-button, .story-navigation-button-and-label.era-pre-colonial.active .story-navigation-button, body.era-pre-colonial .story-narrative-footer {
        background-color: #599FF0;
    }
    .story-navigation-button-and-label.era-pre-colonial:hover .story-navigation-label, .story-navigation-button-and-label.era-pre-colonial.active .story-navigation-label, body.era-pre-colonial #story-narrative h1{
        color: #599FF0;
    }

    /* Styles for .era-migration */
    .story-navigation-button-and-label.era-migration:hover .story-navigation-button {
        background-color: #FFA700;
    }
    .story-navigation-button-and-label.era-migration:hover .story-navigation-label{
        color: #FFA700;
    }

    /* Styles for .era-activism-deindustrialization */
    .story-navigation-button-and-label.era-activism-deindustrialization:hover .story-navigation-button {
        background-color: #EF5402;
    }
    .story-navigation-button-and-label.era-activism-deindustrialization:hover .story-navigation-label{
        color: #EF5402;
    }

    .story-navigation-button img {
        width: 50px;
        height: 50px;
    }

    /* Mobile first positioning */
    #story-navigation {
        left: 20px;
    }

    @media (min-width: 768px){
  
        #story-navigation {
            left: 40px;
        }
        
    }
    
    @media (min-width: 1200px){

        #story-navigation {
            left: 80px;
        } 

    }

</style>
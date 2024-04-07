<script>
    export let active;
</script>

<div id="story-navigation" class="position-fixed">
    <div class="story-navigation-button-group">
        <div class="story-navigation-button-group-header">
            eras
        </div>
        <a href="index11-era-pre-colonial-intro.html">
            <div class="story-navigation-button-and-label era-pre-colonial">
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
        <a href="index11-era-urban-industrial-intro.html">
            <div class="story-navigation-button-and-label era-urban-industrial {active=="urban-industrial"?"active":""}">
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
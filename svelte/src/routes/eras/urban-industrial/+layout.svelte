<script>
    import NavEras from "$lib/components/NavEras.svelte";
</script>

<NavEras active='urban-industrial'/>         
<div id="story-container">
    <div id="story-narrative">
        <slot></slot>
    </div>
    <div class="story-narrative-footer"></div>
</div>
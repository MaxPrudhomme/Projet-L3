<script>
    import { editMode } from "../../store"
    import WidgetBrowser from "./WidgetBrowser.svelte";
</script>

<div id="container" class="absolute">
    {#if $editMode}
        <WidgetBrowser></WidgetBrowser>
    {/if}
</div>

<style>
#container {
    height: 820px;
    width: 1800px;
}
</style>
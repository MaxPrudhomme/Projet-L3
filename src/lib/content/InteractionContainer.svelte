<script>
    import { widgetEdit, courseEdit } from "../../store"
    import WidgetBrowser from "./WidgetBrowser.svelte";
    import CourseBrowser from "./CourseBrowser.svelte";

    // Ce conteneur gère les interactions pour éditer les widgets et les cours
    // This container manages interactions for editing widgets and courses
</script>

<div id="container" class="absolute">
    {#if $widgetEdit}
        <WidgetBrowser></WidgetBrowser>
    {:else if $courseEdit}
        <CourseBrowser></CourseBrowser>
    {/if}
</div>

<style>
    #container {
        height: 50rem;
        width: 111rem;
    }
</style>
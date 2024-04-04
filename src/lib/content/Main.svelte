<script>
    import Scrollbar from "./Scrollbar.svelte";
    import WidgetGrid from "./WidgetGrid.svelte";
    import { fade } from "svelte/transition";
</script>

<div id="container" transition:fade={{duration:500, delay:1000}}>
    <WidgetGrid></WidgetGrid>
    <Scrollbar></Scrollbar>
</div>

<style>
    #container {
        height: 820px;
        width: 1465px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
</style>
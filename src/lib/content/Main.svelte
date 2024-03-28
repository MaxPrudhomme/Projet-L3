<script>
    import Scrollbar from "./Scrollbar.svelte";
    import WidgetGrid from "./WidgetGrid.svelte";
</script>

<div id="container" class="glass noise">
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
<script>
    import Scrollbar from "./Scrollbar.svelte";
    import WidgetGrid from "./WidgetGrid.svelte";
</script>

<div id="container" class="glass">
    <WidgetGrid></WidgetGrid>
    <Scrollbar></Scrollbar>
</div>

<style>
    #container {
        height: 100%;
        width: 82%;
        background-color: rgba(255, 255, 255, 0.3);
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
<script>
    import "../widgets/Schedule_Large.svelte";
	import Schedule_Large from "../widgets/Schedule_Large.svelte";
    export let size;
    export let content;
    const widgetSizes = {
        "s" : [1, 1],
        "r" : [1, 2],
        "m" : [2, 2],
        "l" : [4, 2]
    }

    let containerRef;

    $: if (containerRef) {
    containerRef.style.gridRow = `span ${widgetSizes[size][0]}`;
    containerRef.style.gridColumn = `span ${widgetSizes[size][1]}`;
}
</script>

<div id="container" bind:this={containerRef}>
    <Schedule_Large></Schedule_Large>
</div>


<style>
    #container {
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 30px;
        position: relative;
    }
</style>
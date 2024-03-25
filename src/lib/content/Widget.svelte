<script>
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
    <h1>{content}</h1>
</div>


<style>
    #container {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 30px;
    }
</style>
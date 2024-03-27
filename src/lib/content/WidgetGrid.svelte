<script>
    import Widget from "./Widget.svelte";    
    import Grid, { GridItem } from 'svelte-grid-extended';
    import GridControls from "./GridControls.svelte";
    import { editMode } from "../../store";
    import { widgets } from "../../store";

    let move = false

    $: {
        move = $editMode;
    }

    const itemSize = { width: 170, height: 170 };
</script>



<div id="container">
    <GridControls></GridControls>
    <div id="grid">
    <Grid class="grid-container" rows={4} cols={7} {itemSize} gap={20} collision="none">
        {#each $widgets as item}
            <GridItem bind:x={item.x} bind:y={item.y} bind:w={item.w} bind:h={item.h} resizable={false} previewClass="itemPreview" movable={move}>
                <div class="content">
                    <Widget></Widget>
                </div>
            </GridItem>
        {/each}
    </Grid>
    </div>
</div>

<style>
    #container {
        height: 820px;
        width: 1340px;
    }

    #grid {
        margin-top: -17px;
    }

    .content {
        height: 100%;
        width: 100%;
    }
    
    :global(.itemPreview) {
		background-color: rgb(0, 255, 0, 0.6);
        border-radius: 20px;
        transition: all 0.15s ease;
	}
</style>
<script>
    import Widget from "./Widget.svelte";    
    import Grid, { GridItem } from 'svelte-grid-extended';
    import GridControls from "./GridControls.svelte";
    import { editMode, widgets, overrideAnimations } from "../../store";
    import { fly } from "svelte/transition";

    let move = false;
    let animationDuration = 350;
    let animationPosition = -1340

    $: {
        if ($overrideAnimations) {
            animationDuration = 0
            animationPosition = 0
        } else {
            animationDuration = 350
            animationPosition = -1340
        }
    }

    $: {
        move = $editMode;
    }

    const itemSize = { width: 170, height: 170 };
</script>

<div id="container">
    <GridControls></GridControls>
    <div id="grid">
    <Grid class="grid-container" rows={4} cols={7} {itemSize} gap={20} collision="none">
        {#if $widgets.length === 0}
            <p id="noWidgets">Seems like you don't have any widget yet, try adding your first widgets using the button up top !</p>
        {:else}
            {#each $widgets as {x, y, w, h, content}}
                <div in:fly={{duration: animationDuration, x: animationPosition}} out:fly={{duration: animationDuration, x: animationPosition}}>
                    <GridItem bind:x bind:y bind:w bind:h resizable={false} previewClass="itemPreview" movable={move}>
                        <div class="content">
                            <Widget disabled={editMode ? true: false} {content}></Widget>
                        </div>
                    </GridItem>
                </div>
            {/each}
        {/if}
    </Grid>
    </div>
</div>

<style>
    #container {
        height: 51rem;
        width: 83rem;
    }

    #grid {
        margin-top: -1.5rem;
    }

    .content {
        height: 100%;
        width: 100%;
        position: relative;
    }
    
    :global(.itemPreview) {
		background-color: rgba(0, 255, 0, 0.6);
        border-radius: 20px;
        transition: all 0.15s ease;
	}

    #noWidgets {
        width: 25%;
        font-size: 1.2rem;
        text-align: center;
        margin: auto;
        margin-top: 28%;
    }
</style>
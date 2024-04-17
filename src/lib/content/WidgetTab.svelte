<script>
    import Widget from "./Widget.svelte";    
    import Grid, { GridItem } from 'svelte-grid-extended';
    import GridControls from "./GridControls.svelte";
    import { editMode, widgets, currentView, userUid, currentContent } from "../../store";
    import { db } from "$lib/firebase";
    import { doc, getDoc } from "firebase/firestore";
    import { fly, fade } from "svelte/transition";

    let move = false;

    async function load(view) {
        widgets.set([])
        setTimeout(async () => {
            if (view === "dashboard") {
                const userRef = doc(db, 'users', $userUid);
                const userData = (await getDoc(userRef)).data();
                currentContent.set(userData["content"])
                widgets.set(userData["dashboard"]);
            } else {
                const viewRef = doc(db, 'users', $userUid, 'userCourses', view);
                const viewData = (await getDoc(viewRef)).data();
                currentContent.set(viewData)
                widgets.set(viewData["widgets"]);
            }
        }, 550)
    }

    $: {
        move = $editMode;
    }

    const itemSize = { width: 170, height: 170 };
</script>

<div id="container">
    <GridControls></GridControls>
    <div id="grid" in:fade={{duration: 750, delay: 900}}>
    <Grid class="grid-container" rows={4} cols={7} {itemSize} gap={20} collision="none">
        {#each $widgets as {x, y, w, h, content}}
            <div in:fly={{duration: 500, x:-1340}} out:fly={{duration: 500, x:-1340}}>
                <GridItem bind:x bind:y bind:w bind:h resizable={false} previewClass="itemPreview" movable={move}>
                    <div class="content">
                        <Widget disabled={editMode ? true: false} {content}></Widget>
                    </div>
                </GridItem>
            </div>

        {/each}
    </Grid>
    </div>
</div>

<style>
    #container {
        height: 51rem;
        width: 83rem;
    }

    #grid {
        margin-top: -1rem;
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
</style>
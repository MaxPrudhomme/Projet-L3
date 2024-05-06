<script>
    import {interrogerBaseDeDonnees} from '../functionics';
    import { onMount } from 'svelte';
    onMount(async () => {
    try {
      const param1 = new Date('2024-05-03T00:00:00');
      const param2 = new Date('2024-05-04T00:00:00');
      const data = await interrogerBaseDeDonnees(param1, param2);
      // Vous pouvez utiliser les données ici si nécessaire
      console.log("Résultat de la fonction PHP :", data);
    } catch (error) {
        console.log(error)
      // Gérer les erreurs ici si nécessaire
    }
  });
    import Widget from "./Widget.svelte";    
    import Grid, { GridItem } from 'svelte-grid-extended';
    import GridControls from "./GridControls.svelte";
    import { editMode, widgets, currentView, userUid } from "../../store";
    import { db } from "$lib/firebase";
    import { doc, getDoc } from "firebase/firestore";

    $: {
        const newView = $currentView
        const fetchData = async () => {
            try {
                if (newView === "dashboard") {
                    const userRef = doc(db, 'users', $userUid);
                    const userData = await getDoc(userRef);
                    widgets.set(userData.data()["dashboard"]);
                } else {
                    const viewRef = doc(db, 'users', $userUid, 'userCourses', newView);
                    const viewData = await getDoc(viewRef);
                    widgets.set(viewData.data()["widgets"]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }

    let move = false

    $: {
        move = $editMode;
    }

    const itemSize = { width: 170, height: 170 };

    function deleteWidget() {
        widgets.update(currentWidgets => {
        return currentWidgets.filter(widget => widget.id !== id);
    })
    }
</script>

<div id="container">
    <GridControls></GridControls>
    <div id="grid">
    <Grid class="grid-container" rows={4} cols={7} {itemSize} gap={20} collision="none">
        {#each $widgets as {x, y, w, h, content}}
            <GridItem bind:x bind:y bind:w bind:h resizable={false} previewClass="itemPreview" movable={move}>
                <div class="content">
                    <Widget disabled={editMode ? true: false}></Widget>
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
        position: relative;
    }
    
    :global(.itemPreview) {
		background-color: rgba(0, 255, 0, 0.6);
        border-radius: 20px;
        transition: all 0.15s ease;
	}
</style>
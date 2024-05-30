<script>
    export let folders;
    export let files;
    
    export const activeFolder = writable('Root')

    import Folder from "./Folder.svelte";
    import { storage } from "$lib/firebase";
    import { ref, listAll, getDownloadURL } from "firebase/storage";
    import { currentView } from "../../store";
	import { writable } from "svelte/store";

    // Fonction pour charger le contenu racine
    // Function to load root content
    async function loadRoot(view) {
        if (view === "dashboard") {
            // Conditional handling for dashboard view
        } else {
            // Reference to Firebase storage for course content
            const courseContentRef = ref(storage, 'courseContent/' + view);
            try {
                const res = await listAll(courseContentRef);
                const folderNames = res.prefixes.map(folderRef => folderRef.name);
                const fileNames = await Promise.all(res.items.map(async (itemRef) => {
                    const downloadURL = await getDownloadURL(itemRef);
                    return { name: itemRef.name, downloadURL };
                }));

                // Set folders and files from Firebase data
                folders.set(folderNames);
                files.set(fileNames);
            } catch (error) {
                console.error(error);
            }
        }
    }

    // Fonction pour charger le contenu spécifique d'un dossier
    // Function to load specific folder content
    async function loadContent(view, target) {
        const courseContentRef = ref(storage, 'courseContent/' + view + "/" + target);
        try {
            const res = await listAll(courseContentRef);
            const fileNames = await Promise.all(res.items.map(async (itemRef) => {
                const downloadURL = await getDownloadURL(itemRef);
                return { name: itemRef.name, downloadURL };
            }));

            files.set(fileNames);
            console.log($files)
        } catch (error) {
            console.error(error);
        }
    }

    $: {
    // Automatically load root when the view changes
        loadRoot($currentView);
    }

    $: {
        let target = $activeFolder
        if (target === "Root") {
            loadRoot($currentView)
        } else {
            loadContent($currentView, target);
        }
    }
</script>

<div id="container">
    <p class="widgetTitle">Folders</p>
    <div id="content">
        {#if $folders.length === 0}
            <h3>No folders here !</h3>
        {:else}
            <Folder name={"Root"} {activeFolder}></Folder>
            {#each $folders as folder}
                <Folder name={folder} {activeFolder}></Folder>
            {/each}
        {/if}
    </div>
</div>

<style>
    #container {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        height: 90%;
        width: 40%;
        overflow: hidden;
        margin: 20px;
        margin-right: 10px;
	}

    #content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90%;
        width: 100%;
    }

    h3 {
        margin: auto;
        text-align: center;
    }
</style>
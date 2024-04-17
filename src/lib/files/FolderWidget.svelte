<script>
    export let folders;
    export let files;
    
    export const activeFolder = writable('Root')

    import Folder from "./Folder.svelte";
    import { storage } from "$lib/firebase";
    import { ref, listAll, getDownloadURL } from "firebase/storage";
    import { currentView } from "../../store";
	import { writable } from "svelte/store";

    async function loadRoot() {
        const courseContentRef = ref(storage, 'courseContent/' + $currentView);
        try {
            const res = await listAll(courseContentRef);
            const folderNames = res.prefixes.map(folderRef => folderRef.name);
            const fileNames = await Promise.all(res.items.map(async (itemRef) => {
                const downloadURL = await getDownloadURL(itemRef);
                return { name: itemRef.name, downloadURL };
            }));

            folders.set(folderNames);
            files.set(fileNames);
            console.log($files)
        } catch (error) {
            console.error(error);
        }
    }

    async function loadContent(target) {
    const courseContentRef = ref(storage, 'courseContent/' + $currentView + "/" + target);
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
        let target = $activeFolder
        if (target === "Root") {
            loadRoot()
        } else {
            loadContent(target);
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
	}

    #content {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 90%;
        width: 100%;
    }

    h3 {
        align-self: center;
        text-align: center;
    }
</style>
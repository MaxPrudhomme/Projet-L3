<script>
    import FolderWidget from "./FolderWidget.svelte";
	import FileWidget from "./FileWidget.svelte";
    import { writable } from "svelte/store";

    // Définit des stores réactifs pour gérer les dossiers et les fichiers affichés dans l'onglet
    // Defines reactive stores to manage folders and files displayed in the tab
    export const folders = writable([]);
    export const files = writable([]);
</script>

<div id="container">
    <FolderWidget {folders} {files}></FolderWidget>
    <FileWidget {files}></FileWidget>
</div>


<style>
    #container {
        height: 51rem;
        width: 83rem;
        display: flex;
        align-items: center;
    }
</style>
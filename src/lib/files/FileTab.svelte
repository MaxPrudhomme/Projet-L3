<script>
    import FolderWidget from "./FolderWidget.svelte";
	import FileWidget from "./FileWidget.svelte";
    import { writable } from "svelte/store";

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
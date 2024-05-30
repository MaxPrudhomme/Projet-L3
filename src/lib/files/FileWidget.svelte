<script>
    export let files;
    import File from "./File.svelte";
    
    // Le composant s'attend à recevoir une liste de fichiers à afficher
    // The component expects to receive a list of files to display
</script>

<div id="container">
    <p class="widgetTitle">Files</p>
    <div id="content">
        {#if $files.length === 0}
            <h3>No files in this folder yet !</h3>
        {:else}
            {#each $files as {name, downloadURL}}
                <File name={name} path={downloadURL}></File>
            {/each}
        {/if}
    </div>
</div>

<style>
    #container {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        height: 90%;
        width: 58%;
        margin: 20px;
        margin-left: 10px;
        overflow: hidden;
	}

    #content {
        display: flex;
        flex-direction: column;
        height: 90%;
        width: 100%;
    }

    h3 {
        margin: auto;
        text-align: center;
    }
</style>
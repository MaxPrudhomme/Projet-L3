<script>
    export let files;
    import File from "./File.svelte";
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
        overflow: hidden;
	}

    #content {
        display: flex;
        flex-direction: column;
        height: 90%;
        width: 90%;
        margin: auto;
    }

    p {
        margin-bottom: 1rem;
    }

    h3 {
        width: 100%;
        align-self: center;
        text-align: center;
    }
</style>
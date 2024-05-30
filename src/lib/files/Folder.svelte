<script>
    export let name;
    export let activeFolder;

    import FileIcon from "./FileIcon.svelte";

    // Fonction pour modifier le dossier actif
    // Function to change the active folder
    function changeActiveFolder() {
        activeFolder.set(name)
    }
</script>

<button id="container" class="buttonReset" on:click={changeActiveFolder}>
    {#if name !== "Root"}
        <FileIcon name={"arrow-return-right"} class={"s32x32 mL2rem"}></FileIcon>
    {/if}
    <FileIcon name={'folder'} class={'s48x48 mL1rem'}></FileIcon>
    <p>{name}</p>
</button>

<style>
    #container {
        width: 90%;
        height: 5rem;
        display: flex;
        align-items: center;
        border-bottom: 1px dashed black;
        text-align: start;
    }

    p {
        width: 70%;
        font-size: 1.5rem;
        margin-left: 1rem;
    }
</style>
<script>
    export let name = null;
    export let path = null;

    import FileIcon from "./FileIcon.svelte";

    const openFile = () => {
        window.open(path, '_blank');
    };

    const getFileExtension = () => {
        return name.split('.').pop();
    };

    $: extension = getFileExtension();
</script>

<button on:click={openFile} id="container" class="buttonReset">
    <FileIcon name={"filetype-" + extension} class={"s48x48"}></FileIcon>
    <p>{name}</p>
</button>

<style>
    #container {
        display: flex;
        margin-top: 1rem;
        align-items: center;
        overflow: hidden;
        text-align: start;
    }
    p {
        font-size: 1rem;
        margin-left: 1rem;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.75);
    }
</style>

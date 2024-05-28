<script>
    export let name = null;
    export let path = null;

    import FileIcon from "./FileIcon.svelte";

    // Fonction pour ouvrir le fichier dans un nouvel onglet
    // Function to open the file in a new tab
    const openFile = () => {
        window.open(path, '_blank');
    };

    // Fonction pour obtenir l'extension du fichier à partir du nom
    // Function to get the file extension from the name
    const getFileExtension = () => {
        return name.split('.').pop();
    };

    // Réactivement calculer l'extension quand le nom du fichier change
    // Reactively calculate the extension when the file name changes
    $: extension = getFileExtension();
</script>

<button on:click={openFile} id="container" class="buttonReset">
    <FileIcon name={"filetype-" + extension} class={"s48x48"}></FileIcon>
    <p>{name}</p>
</button>

<style>
    #container {
        display: flex;
        margin-left: 5%;
        margin-top: 1rem;
        align-items: center;
        overflow: hidden;
        text-align: start;
        width: 90%;
    }
    p {
        font-size: 1rem;
        margin-left: 1rem;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.75);
    }
</style>

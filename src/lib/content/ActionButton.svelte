<script>
    export let content;
    export let mode;
    export let onClickFunction;
    export let disabled;

    let self;

    // Définit la couleur de fond du bouton en fonction du mode et de l'état désactivé
    // Sets the background color of the button based on the mode and disabled state
    $: backgroundColor = disabled
        ? 'rgba(0, 0, 0, 0.3)'
        : mode === 'confirm'
        ? '#3B6EFD'
        : mode === 'alert'
        ? '#EE0B00'
        : '';

    // Fonction gérant le clic sur le bouton, déclenchant la fonction associée si le bouton n'est pas désactivé
    // Function handling the button click, triggering the associated function if not disabled
    async function handleClick() {
        if (!disabled) {
            onClickFunction();
        }
    }
</script>

<button bind:this={self} id="container" class="buttonReset" on:click={handleClick} style="background-color: {backgroundColor};" disabled={disabled}>{content}</button>

<style>
    #container {
        width: 16rem;
        height: 4rem;
        border-radius: 1rem;
        color: white;
        font-size: 1.7rem;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.3s ease;
    }

    #container:disabled {
        cursor: not-allowed;
    }
</style>

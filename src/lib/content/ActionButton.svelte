<script>
    export let content;
    export let mode;
    export let onClickFunction;
    export let disabled;

    let self;

    $: backgroundColor = disabled
        ? 'rgba(0, 0, 0, 0.3)'
        : mode === 'confirm'
        ? '#3B6EFD'
        : mode === 'alert'
        ? '#EE0B00'
        : '';

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

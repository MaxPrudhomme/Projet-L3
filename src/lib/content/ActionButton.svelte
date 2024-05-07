<script>
    import { onMount } from "svelte";
    
    export let content;
    export let mode;
    export let onClickFunction;
    export let disabled;

    let self;

    async function handleClick() {
        if (!disabled) {
            onClickFunction();
        }

    }

    onMount(() => {
        if (!disabled) {
            if (mode === 'alert') {
                self.style.backgroundColor = '#EE0B00';
            } else if (mode === 'confirm') {
                self.style.backgroundColor = '#3B6EFD';
            }
        }
    });

    function updateBackgroundColor() {
        if (!disabled) {
            if (mode === 'alert') {
                self.style.backgroundColor = '#EE0B00';
            } else if (mode === 'confirm') {
                self.style.backgroundColor = '#3B6EFD';
            }
        }
    }

    $: {
        const v = disabled
        updateBackgroundColor();
    }


</script>

<button bind:this={self} id="container" class="buttonReset" on:click={handleClick}>{content}</button>

<style>
    #container {
        background-color: rgba(0, 0, 0, 0.3);
        width:16rem;
        height: 4rem;
        border-radius: 1rem;
        color: white;
        font-size: 1.7rem;
    }
</style>
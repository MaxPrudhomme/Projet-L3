<script>
    import { onMount } from 'svelte';
    
    export let height = null;
    export let width = null;
    export let disabled = false;

    let containerRef;
    let blockerRef;
    
    onMount(() => {
        if (height !== null && width !== null) {
            containerRef.style.height = height + 'px';
            containerRef.style.width = width + 'px';
            blockerRef.style.height = height + 'px';
            blockerRef.style.width = width + 'px';
        }
    });
</script>

<div id="container" bind:this={containerRef}>
    {#if disabled}
        <div id="blocker" bind:this={blockerRef} style="visibility: visible;"></div>
    {:else}
        <div id="blocker" bind:this={blockerRef} style="visibility: hidden;"></div>
    {/if}
</div>

<style>
    #container {
        display: inline-flex;
        position: relative;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        height: 100%;
        width: 100%
    }

    #blocker {
        border-radius: 20px;
        cursor: pointer;
    }

</style>

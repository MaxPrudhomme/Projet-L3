<script>
    import Scrollbar from "./Scrollbar.svelte";
    import WidgetTab from "./WidgetTab.svelte";
    import FileTab from "$lib/files/FileTab.svelte";
    import { fade } from "svelte/transition";
    import { currentTab, currentView, currentContent } from "../../store";
	import { onMount } from "svelte";

    onMount(() => {
        currentView.set("dashboard")
    })
</script>

<div id="container" in:fade={{duration:500, delay:1000}} out:fade={{duration: 150}}>
    {#if $currentTab === 'widgets'}
        <WidgetTab></WidgetTab>
    {:else if $currentTab === 'files'}
        <FileTab></FileTab>
    {/if}
    <Scrollbar></Scrollbar>
</div>

<style>
    #container {
        height: 820px;
        width: 1465px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        overflow: hidden;
    }
</style>
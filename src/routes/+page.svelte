<script>
    import Sidebar from "../lib/sidebar/Sidebar.svelte";
    import Main from "../lib/content/Main.svelte";
    import "../global.css";
    import { interactionActive } from "../store";
    import { fade } from "svelte/transition";
    import InteractionContainer from "$lib/content/InteractionContainer.svelte";
</script>

{#if $interactionActive}
<div id="configContainer" transition:fade={{duration:150}}>
    <InteractionContainer></InteractionContainer>
</div>
{/if }

<div id="contentContainer" class="absolute">
    <Sidebar></Sidebar>
    <Main></Main>
</div>

<style>
    #contentContainer {
        width: 1800px;
        height: 820px;
        display: flex;
        overflow:hidden;
        border-radius: 25px;
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.30);
        z-index: -1;
    }
    #configContainer {
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.3 );
        backdrop-filter: blur(5px);
        transition: all 0.5s ease;
    }

</style>
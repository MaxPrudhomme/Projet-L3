<script>
    import "../global.css";
    import { fade } from "svelte/transition";

    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import Main from "$lib/content/Main.svelte";
    import Login from "$lib/login/Login.svelte";
    import InteractionContainer from "$lib/content/InteractionContainer.svelte";
    
    import { interactionActive, userUid } from "../store";

    let contentContainer;
    $: {
        if (contentContainer) {
        if ($userUid !== null) {
            contentContainer.style.width = "1800px";
        } else {
            contentContainer.style.width = "400px"; 
        }
        }
    }
</script>

{#if $interactionActive}
<div id="configContainer" transition:fade={{duration:150}}>
    <InteractionContainer></InteractionContainer>
</div>
{/if }

<div id="contentContainer" class="absolute glass noise" bind:this={contentContainer}>
    {#if $userUid === null}
        <Login></Login>
    {:else}    
        <Sidebar></Sidebar>
        <Main></Main>
    {/if}
</div>

<style>
    #contentContainer {
        width: 400px;
        height: 820px;
        display: flex;
        overflow:hidden;
        border-radius: 25px;
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.30);
        z-index: -1;
        background-color: rgba(255, 255, 255, 0.3);
        transition: all 1s ease;
    }
    #configContainer {
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.3 );
        backdrop-filter: blur(5px);
        transition: all 0.5s ease;
    }

</style>
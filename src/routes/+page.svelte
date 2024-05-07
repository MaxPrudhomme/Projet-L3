<script>
    import "../global.css";
    import { fade, fly } from "svelte/transition";
    import Sidebar from "$lib/sidebar/Sidebar.svelte";
    import Main from "$lib/content/Main.svelte";
    import Login from "$lib/login/Login.svelte";
    import Signup from "$lib/login/Signup.svelte/";
    import InteractionContainer from "$lib/content/InteractionContainer.svelte";
    
    import { currentView, interactionActive, userUid } from "../store";
    import { setPersistence, browserSessionPersistence, onAuthStateChanged } from "firebase/auth";
    import { auth } from "$lib/firebase";
    import { writable } from "svelte/store";


    let contentContainer;
    let isAuthenticated = false;  
    let signupProcess = writable(false);

    onAuthStateChanged(auth, (user) => {
        isAuthenticated = !!user;
    });

    $: {
        setTimeout(() => {
            if (contentContainer) {
            if (isAuthenticated) {
                contentContainer.style.width = "1800px";
            } else {
                contentContainer.style.width = "400px"; 
            }
        }
        }, 500)

    }
    
    setPersistence(auth, browserSessionPersistence)
    .then(async () => {
        userUid.set(auth.currentUser.uid)
        currentView.set("dashboard")
    })
    .catch((error) => {
        console.log(error)
    })
</script>

{#if $interactionActive}
<div id="configContainer" in:fade={{duration:150, delay:650}} out:fade={{duration: 150}}>
    <InteractionContainer></InteractionContainer>
</div>
{/if }

<div id="contentContainer" class="absolute glass noise" bind:this={contentContainer}>
    {#if isAuthenticated === false}
        {#if $signupProcess}
            <Signup></Signup>
        {:else}
            <Login {signupProcess}></Login>
        {/if}
    {:else if $userUid }
        <div in:fly={{ x: -1000, duration: 750, delay: 900}} out:fly={{ x: -1000, duration: 750}}>
            <Sidebar></Sidebar>
        </div>
        <div in:fade={{duration: 750, delay: 1100}} out:fade={{duration: 150}}>
            <Main></Main>
        </div>
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
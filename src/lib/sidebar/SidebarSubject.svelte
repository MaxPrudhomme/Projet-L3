<script>
    export let subject = null;
    export let tag = null;
    export let icon = null;
    export let id = null;
    import Icon from '$lib/Icon.svelte'
    import { currentView } from '../../store';

    // Demande l'affichage du cours sélectionné
    // Requests display of the selected course
    async function requestView() {
        currentView.set(id)
    }

</script>

<button class="buttonReset" on:click={requestView}>
    <Icon name={icon} class={"s36x36"}></Icon>
    {#if tag}
        <p>{tag}</p>
    {:else} 
        <p>{subject}</p>
    {/if}
</button>

<style>
    button {
        background-color: rgba(255, 255, 255, 0.3);    
        border-radius: 5px;
        transition: all 0.5s ease;
        text-align: left;
        width: 275px;
        height: 60px;
        margin-top: 15px;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }
    
    button:hover {
        background-color: rgba(255, 255, 255, 0.6);
    }

    p {
        color: black;
        font-size: 26px;
        margin-left: 10px;
    }
</style>
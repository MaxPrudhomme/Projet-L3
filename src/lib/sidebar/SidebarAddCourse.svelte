<script>
    import Icon from '$lib/Icon.svelte'
    import { interactionActive, courseEdit } from '../../store';

    function triggerInteraction() {
        interactionActive.set(true)
        courseEdit.set(true)
    }
</script>

<button class="buttonReset" on:click={triggerInteraction}>
    <Icon name={"plus-circle"} class={"s36x36"}></Icon>
    <p>Add a Course</p>
</button>

<style>
    button {
        border: 2px dashed black;
        border-radius: 10px;
        transition: all 0.5s ease;
        text-align: left;
        width: 100%;
        height: 3.75rem;
        display: flex;
        align-items: center;
        padding-left: 12px;
        background-color: transparent;
    }

    button:hover {
        box-shadow: inset 0 0 0 1000px rgba(255, 255, 255, 0.6);
    }

    p {
        color: black;
        font-size: 1.65rem;
        margin-left: 0.8rem;
    }
</style>
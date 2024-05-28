<script>
    import { currentTab } from "../../store";
    import { overrideAnimations } from "../../store";

    // Function to handle tab selection from the scrollbar
    function handleSelection(event) {
        currentTab.set(event.target.value);
        overrideAnimations.set(true)
        setTimeout(() => {
            overrideAnimations.set(false)
        }, 500)
    }
</script>

<div id="container">
    <input type="radio" name="selector" value="widgets" bind:group={$currentTab} on:change={handleSelection} checked="true">
    <input type="radio" name="selector" value="files" bind:group={$currentTab} on:change={handleSelection}>
    <!--<input type="radio" name="selector" value="comms" bind:group={$currentTab} on:change={handleSelection}>-->
</div>

<style>
    #container {
        background-color: rgba(0, 0, 0, 0.2);
        width: 1.8rem;
        height: 10%;
        border-radius: 15px;
        box-shadow: inset -1px -1px 4px rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    input[type="radio"] {
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        -o-appearance: none;
        -ms-appearance: none;
        background-color: rgba(0, 0, 0, 0.25);
        box-shadow: inset -1px -1px 1px rgba(0, 0, 0, 0.2);
        width: 0.7rem;
        height: 0.7rem;
        border-radius: 0.7rem;
        transition: all 0.2s ease;
    }

    input[type="radio"]:checked  {
        background-color: rgba(255, 255, 255, 0.75);
        box-shadow: none;;
    }

</style>
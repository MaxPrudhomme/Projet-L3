<script>
    import Icon from "$lib/Icon.svelte";

    export let current;

    function updateCurrent(caller) {
        if (caller) {
            if ($current > 0) {
                current.set($current -= 1);
            }
        } else {
            if ($current < 2) {
                current.set($current += 1);
            }
        }
    }
</script>

<div id="container">
    <button class="buttonReset controls" on:click={() => updateCurrent(true)}>
        <Icon name={"arrow-left-circle-fill"} class={"s32x32 confirmBlueFilter"}></Icon>
    </button>

    <button class="buttonReset controls" on:click={() => updateCurrent(false)}>
        <Icon name={"arrow-right-circle-fill"} class={"s32x32 confirmBlueFilter"}></Icon>  
    </button>
</div>


<style>
    #container {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }
</style>
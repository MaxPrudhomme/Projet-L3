<script>
    import Icon from "$lib/Icon.svelte";

    export let value; 
    export let key;
    export let selectedCourses;

    let bool = false;

    function updateSelection() {
        bool = !bool;
        if (bool) {
                if (!$selectedCourses.includes(key)) {
                    selectedCourses.set([...$selectedCourses, key])
                }
            } else {
                selectedCourses.set($selectedCourses.filter($selectedCourses => $selectedCourses !== key))
            }
    }
</script>

<button class="course buttonReset" on:click={updateSelection}>
    {#if bool}
        <Icon name={"check-circle"} class={"s24x24"}></Icon>
    {:else}
        <Icon name={"plus-circle"} class={"s24x24"}></Icon> 
    {/if}

    <p>{value}</p>
</button>

<style> 
    .course {
        display: flex;
        line-height: 1.5rem;
        font-size: 1.5rem;
        height: 1.5rem;
        width: 90%;
        height: 1.5rem;
        margin-top: 1rem;
    }

    p {
        margin-left: 0.5rem;
    }
</style>
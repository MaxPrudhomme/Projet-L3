<script>
    import Icon from "$lib/Icon.svelte";
    
    export let selectedCourses;
    export let value; 
    export let key;

    let bool = false;

    // Fonction pour mettre à jour la sélection des cours
    // Function to update the selection of courses
    function updateSelection() {
        bool = !bool; // Toggle the selection state
        selectedCourses.update(courses => {
            if (bool) {
                if (!courses.includes(key)) {
                    return [...courses, key]; // Add the course key to the selection if not already included
                }
            } else {
                return courses.filter(course => course !== key); // Remove the course key from the selection
            }
            return courses;
        });
    }
</script>

<button class="course buttonReset { bool ? 'confirmGreenColor' : ''}" on:click={updateSelection}>
    {#if bool}
        <Icon name={"check-circle"} class={"s24x24 confirmGreenFilter"}></Icon>
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
        margin-top: 1rem;
    }

    p {
        margin-left: 0.5rem;
    }
</style>

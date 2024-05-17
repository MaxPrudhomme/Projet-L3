<script>
	import { onMount } from "svelte";
    import { user } from "../../store";
    import { getDoc } from "firebase/firestore";
	import { writable } from "svelte/store";
    import CourseCategory from "./CourseCategory.svelte";
    import ActionButton from "./ActionButton.svelte";

    export const selectedCourses = writable([])

    let schoolData;

    onMount(async () => {
        try {  
            const schoolRef = $user["school"] 
            schoolData = (await getDoc(schoolRef)).data()
            console.log(schoolData)
        } catch(e) {
            console.log("Error : ", e)
        }
    })

</script>

<div id="container">
    {#if schoolData}
        <h1>Chooses your courses offered by {schoolData.name} below</h1>
        <div id="categoryContainer">
            {#each Object.entries(schoolData.offeredCourses) as [key, value]}
                <CourseCategory courses={value} category={key} {selectedCourses}></CourseCategory>
            {/each}
        </div>
        <ActionButton content={"Register Courses"} mode={"confirm"} onClickFunction={null}></ActionButton>
    {/if}
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #categoryContainer {
        margin-top: 2rem;
        display: flex;
        overflow-x: auto;
        height: 75%;
        width: 100%;
        margin-bottom: 2rem;
    }

    h1 {
        text-align: center;
        text-decoration: underline;
    }
</style>
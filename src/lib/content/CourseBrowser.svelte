<script>
    import { onMount } from "svelte";
    import { userUid, user, courseEdit, interactionActive, requestUpdateSidebar } from "../../store";
    import { getDoc } from "firebase/firestore";
    import { writable, get } from "svelte/store";
    import CourseCategory from "./CourseCategory.svelte";
    import ActionButton from "./ActionButton.svelte";

    export const selectedCourses = writable([]);

    let schoolData;

    onMount(async () => {
        try {
            const schoolRef = $user["school"];
            schoolData = (await getDoc(schoolRef)).data();
            console.log(schoolData);
        } catch(e) {
            console.log("Error : ", e);
        }
    });

    async function registerCourses() {
        const courses = get(selectedCourses)
        const userId = $userUid;

        const data = {
            userId: userId,
            selectedCourses: courses
        }

        console.log(data)

        const response = await fetch('https://us-central1-projet-l3-88394.cloudfunctions.net/registerCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const contentType = response.headers.get("content-type");
        let result;

        if (contentType && contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (response.ok) {
            console.log("Courses registered successfully:", result);
            alert("Courses registered successfully");
            courseEdit.set(false)
            interactionActive.set(false)
            requestUpdateSidebar.set(true)
        } else {
            console.error("Error registering courses:", result);
            alert("There was an error registering the courses, please try again later or contact support.");
        }
    }

    function leaveBrowser() {
        courseEdit.set(false)
        interactionActive.set(false)
    }
</script>

<div id="container">
    {#if schoolData}
    <div id="topContainer">
        <h1>Choose your courses offered by {schoolData.name} below</h1>
        <button id="leaveButton" on:click={leaveBrowser}>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="0 0 16 16">
                <path d="M8.538 1.02a.5.5 0 1 0-.076.998 6 6 0 1 1-6.445 6.444.5.5 0 0 0-.997.076A7 7 0 1 0 8.538 1.02"/>
                <path d="M7.096 7.828a.5.5 0 0 0 .707-.707L2.707 2.025h2.768a.5.5 0 1 0 0-1H1.5a.5.5 0 0 0-.5.5V5.5a.5.5 0 0 0 1 0V2.732z"/>
            </svg>
        </button>
    </div>    
    <div id="categoryContainer">
        {#each Object.entries(schoolData.offeredCourses) as [key, value]}
            <CourseCategory courses={value} category={key} {selectedCourses} />
        {/each}
    </div>
    <ActionButton content={"Register Courses"} mode={"confirm"} onClickFunction={registerCourses}></ActionButton>
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
        justify-content: space-evenly;
        overflow-x: auto;
        height: 75%;
        width: 100%;
        margin-bottom: 2rem;
    }

    h1 {
        flex-grow: 1;
        text-align: center;
        text-decoration: underline;
    }

    #leaveButton {
        border: none;
        background: none;
        padding: 0;
        margin: 0;
        cursor: pointer;
        transition: all 0.5s ease;
        margin: 5px;
        height: 32px;
        opacity: 0.7;
    }

    #leaveButton:hover {
        opacity: 1;
    }

    #topContainer {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: space-between;
        padding: 0 1rem;
    }
</style>

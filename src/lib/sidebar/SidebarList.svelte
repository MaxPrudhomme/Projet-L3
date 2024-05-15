<script>
	import { onMount } from "svelte";
    import { userUid } from "../../store";
	import { collection, getDocs, where, query } from "firebase/firestore";
    import { db } from "$lib/firebase";
	import SidebarSubject from "./SidebarSubject.svelte";
    import { writable } from "svelte/store"
	import SidebarAddCourse from "./SidebarAddCourse.svelte";

    let coursesList = writable([]);

    onMount(async () => {
        try {
            const userCoursesIds = (await getDocs(collection(db, 'users', $userUid, 'userCourses'))).docs.map(({ id }) => id);
            if (userCoursesIds.length === 0) {
                coursesList.set([]);
                return;
            }

            const coursesRef = collection(db, 'courses');
            const coursesSnapshot = await getDocs(query(coursesRef, where('__name__', 'in', userCoursesIds)));

            coursesList.update(list => {
                coursesSnapshot.docs.forEach((doc) => {
                    list.push({ ...doc.data(), id: doc.id });
                });
                console.log(list);
                return list;
            });
        } catch (error) {
            console.error("Error fetching courses:", error);
            coursesList.set([]);
        }
    });
</script>

<div id="container"> 
    <div id="courseContainer">
        {#if $coursesList.length === 0}
            <p id="noCourses">Seems like you don't have any course yet, try adding your first courses below !</p>
        {:else}
            {#each $coursesList as {icon, tag, subject, id} }
                <SidebarSubject {icon} {tag} {subject} {id}></SidebarSubject>
            {/each}
        {/if}
    </div>
    <div id="addContainer">
        <SidebarAddCourse></SidebarAddCourse>
    </div>
</div>

<style>
    #container {
        width: 17.2rem;
        height: 38.125rem;
        border-top: 1px solid black; 
        border-bottom: 1px solid black;
        margin: auto;
        margin-top: 30px;
        position: relative;
    }

    #noCourses {
        width: 80%;
        font-size: 1.2rem;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        margin: auto;
        z-index: -1;
    }

    #addContainer {
        position: absolute;
        bottom: 1rem;
        width: 100%;
    }

    #courseContainer {
        overflow-x: hidden;
        overflow-y: auto;
        height: 85%
    }
</style>
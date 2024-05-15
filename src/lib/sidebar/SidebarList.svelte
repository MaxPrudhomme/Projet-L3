<script>
	import { onMount } from "svelte";
    import { userUid } from "../../store";
	import { collection, getDocs, where, query } from "firebase/firestore";
    import { db } from "$lib/firebase";
	import SidebarSubject from "./SidebarSubject.svelte";
    import { writable } from "svelte/store"

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
    {#if $coursesList.length === 0}
        <p id="noCourses">Seems like you don't have any course yet, try adding your first courses below !</p>
    {:else}
        {#each $coursesList as {icon, tag, subject, id} }
            <SidebarSubject {icon} {tag} {subject} {id}></SidebarSubject>
        {/each}
    {/if}
</div>

<style>
    #container {
        width: 275px;
        height: 610px;
        border-top: 1px solid black; 
        border-bottom: 1px solid black;
        margin: auto;
        margin-top: 30px;
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
    }
</style>
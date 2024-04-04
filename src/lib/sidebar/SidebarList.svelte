<script>
	import { onMount } from "svelte";
    import { userUid } from "../../store";
	import { collection, getDocs, where, query } from "firebase/firestore";
    import { db } from "$lib/firebase";
	import SidebarSubject from "./SidebarSubject.svelte";

    let coursesList = []

    onMount(async () => {
        const userCoursesIds = (await getDocs(collection(db, 'users', $userUid, 'userCourses'))).docs.map(({ id }) => id);
        const coursesRef = await collection(db, 'courses')
        
        const coursesSnapshot = await getDocs(query(coursesRef, where('__name__', 'in', userCoursesIds)));
        coursesSnapshot.docs.forEach((doc) => {
            coursesList.push({ ...doc.data(), id: doc.id});
        });
    })
</script>

<div id="container">
    {#each coursesList as {icon, tag, subject} }
        <SidebarSubject {icon} {tag} {subject}></SidebarSubject>
    {/each}
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
</style>
<script>
    import HomeworkItem from './HomeworkItem.svelte';
    import { currentContent, currentView, userUid } from '../../store';
    import { onMount } from 'svelte';
    import { collection, getDocs, query, orderBy } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    let homework = new Map();

    onMount(async () => {
		const existingHomework = $currentContent["homework"] 
		if (existingHomework && typeof existingHomework === 'object') {
        	Object.entries(existingHomework).forEach(([id, data]) => {
            	homework.set(id, data);
        	});
    	}

        try {
            const courseRef = collection(db, 'courses', $currentView, 'homework');
            const q = query(courseRef, orderBy('dueDate'));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.status = data.status[$userUid];
                homework.set(doc.id, data)
            });
			homework = new Map(homework);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    });
</script>

<div id="container">
    <h1 class="widgetTitle">Homework</h1> 
    <div id="homeworkContainer">
		{#each [...homework] as [id, {author, givenDate, dueDate, status, tasks}]}	 
        	<HomeworkItem {id} {author} {givenDate} {dueDate} {status} {tasks}></HomeworkItem>
        {/each}
    </div>
</div>

<style>
    #container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>

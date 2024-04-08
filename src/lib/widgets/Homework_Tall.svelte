<script>
	import HomeworkItem from './HomeworkItem.svelte';
	import { currentContent, currentView, userUid } from '../../store';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs } from 'firebase/firestore';
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
			let courseRef = collection(db, 'courses', $currentView, 'homework');
			let courseSnapshot = await getDocs(courseRef);
			courseSnapshot.forEach((doc) => {
				const data = doc.data()
				data["status"] = data["status"][$userUid] 
				homework.set(doc.id, data)
        	});
			homework = new Map(homework);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		let sortedHomeworkArray = [...homework].sort(([idA, dataA], [idB, dataB]) => {
        const datePartsA = dataA.dueDate.split('/').map(part => parseInt(part, 10));
        const datePartsB = dataB.dueDate.split('/').map(part => parseInt(part, 10));
        const dateA = new Date(datePartsA[2], datePartsA[1] - 1, datePartsA[0]);
        const dateB = new Date(datePartsB[2], datePartsB[1] - 1, datePartsB[0]);

        return dateA - dateB;
    });
    homework = new Map(sortedHomeworkArray);
	})
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

<script>
	import MarkItem from './MarkItem.svelte';
	import { currentContent, currentView, userUid } from '../../store';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Icon from '$lib/Icon.svelte';

	let currentSemester = 1; // true if first semester, false if second semester

	export const getSchoolDataById = async (schoolDocRef) => {
		const schoolSnapshot = await getDoc(schoolDocRef);
		return schoolSnapshot.data();
	};

	let marks = new Map();
	let firstSemesterMarks = new Map(); // comment qu'on fait pour choper les dates de semestre ?
	let secondSemesterMarks = new Map(); // demander à Max
	onMount(async () => {
		try {
			let courseRef = collection(db, 'courses', $currentView, 'exam');
			let courseSnapshot = await getDocs(courseRef);
			// let rootCourseRef = await getDocs(collection(db, 'courses', $currentView));
			// let schoolData = await getSchoolDataById(await getDocs(rootCourseRef).school);
			let j = 0;
			courseSnapshot.forEach((doc) => {
				const data = doc.data();
				data['mark'] = data['mark'][$userUid];
				let date = new Date(data['date'].seconds * 1000);
				data['date'] = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
				marks.set(j, data);
				j++;
			});
			marks = new Map(marks);

			// let k = 0;
			// let l = 0;
			// marks.forEach((mark) => {
			// 	let semOneEnd = new Date(schoolData.semester1.end.seconds * 1000);
			// 	if (mark.date <= semOneEnd) {
			// 		firstSemesterMarks.set(k, mark);
			// 		k++;
			// 	} else {
			// 		secondSemesterMarks.set(l, mark);
			// 		l++;
			// 	}
			// });
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		let sortedMarks = [...marks].sort(([idA, dataA], [idB, dataB]) => {
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});
		marks = new Map(sortedMarks);
	});
</script>

<div id="container">
	<h1 id="title">Marks</h1>

	<div id="display">
		{#key currentSemester}
			{#if currentSemester == 1}
				{#each [...marks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each}
			{/if}
			{#if currentSemester == 2}
				<!-- {#each [...marks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each} -->
			{/if}
		{/key}
	</div>

	<!-- <div id="display">
		{#key currentSemester}
			{#if currentSemester == 1}
				{#each [...firstSemesterMarks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each}
			{/if}
			{#if currentSemester == 2}
				{#each [...secondSemesterMarks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each}
			{/if}
		{/key}
	</div> -->

	<div id="periods">
		<button
			on:click={() => {
				currentSemester = 1;
			}}>P1</button
		>
		<button
			on:click={() => {
				currentSemester = 2;
			}}>P2</button
		>
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
		overflow-x: hidden;
		width: 360px;
	}

	#display {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
		align-items: center;
		height: 90%;
		transition: fadeIn 2s ease-in;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 100%;
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 100%;
		}
		to {
			opacity: 0;
		}
	}

	#title {
		text-align: center;
		align-self: center;
		font-family: 'SF Pro Display';
		font-weight: normal;
		color: rgb(0, 0, 0, 0.5);
		font-size: 20px;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#periods {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-top: 1px solid rgb(0, 0, 0, 0.5);
		vertical-align: bottom;
		padding-top: 5px;
		padding-left: 20%;
		padding-right: 20%;
		margin-left: 5%;
		margin-right: 5%;
	}

	button {
		background: none;
		font-family: 'SF Pro Display';
		font-weight: normal;
		font-size: large;
		color: rgb(0, 0, 0, 0.5);
		background: none;
		border: 1px solid rgba(0, 0, 0, 0);
		padding: 5px;
		outline: inherit;
		/* margin-left: 15%;
		margin-right: 15%; */
		margin-bottom: 10px;
	}

	button:hover {
		border: 1px solid rgb(0, 0, 0, 0.5);
		border-radius: 5px;
	}
</style>

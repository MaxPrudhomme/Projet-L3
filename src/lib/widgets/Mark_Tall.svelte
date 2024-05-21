<script>
	import MarkItem from './MarkItem.svelte';
	import { currentContent, currentView, userUid } from '../../store';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fade } from 'svelte/transition';
	import Icon from '$lib/Icon.svelte';

	let currentSemester;

	export const getSchoolDataById = async (schoolDocRef) => {
		const schoolSnapshot = await getDoc(schoolDocRef);
		return schoolSnapshot.data();
	};

	let marks = new Map();
	// marks are separated between each semester (to avoid a single massive list)
	let firstSemesterMarks = new Map();
	let secondSemesterMarks = new Map();
	onMount(async () => {
		// fetches all of the student's marks for the cours
		try {
			let courseRef = collection(db, 'courses', $currentView, 'exam');
			let courseSnapshot = await getDocs(courseRef);

			let j = 0;
			courseSnapshot.forEach((doc) => {
				const data = doc.data();
				if (JSON.stringify(data.mark) !== '{}') {
					// minor data formatting
					data['mark'] = data['mark'][$userUid];
					let date = new Date(data['date'].seconds * 1000);
					data['date'] =
						date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
					marks.set(j, data);
					j++;
				}
			});
			marks = new Map(marks);

			let k = 0;
			let l = 0;
			marks.forEach((mark) => {
				// assign each mark to its semester
				if (mark.semester == 1) {
					firstSemesterMarks.set(k, mark);
					k++;
				} else {
					secondSemesterMarks.set(l, mark);
					l++;
				}
			});
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		let sortedMarksOne = [...firstSemesterMarks].sort(([idA, dataA], [idB, dataB]) => {
			// sorts marks
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});
		let sortedMarksTwo = [...secondSemesterMarks].sort(([idA, dataA], [idB, dataB]) => {
			// sorts marks
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});
		firstSemesterMarks = new Map(sortedMarksOne);
		secondSemesterMarks = new Map(sortedMarksTwo);
		currentSemester = 1;
	});

	console.log(marks);
</script>

<div id="container">
	<h1 class="widgetTitle">Marks</h1>

	<!-- display of marks (changes when another semester is selected) -->
	{#key currentSemester}
		<div id="display" in:fade={{ delay: 250, duration: 300 }}>
			<!-- transition foireuse sur le out -->
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
		</div>
	{/key}

	<!-- semester change button -->
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
	@import '../../global.css';

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

	/* #title {
		text-align: center;
		align-self: center;
		font-family: 'SF Pro Display';
		font-weight: normal;
		color: rgb(0, 0, 0, 0.5);
		font-size: 20px;
		margin-top: 10px;
		margin-bottom: 20px;
	} */

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

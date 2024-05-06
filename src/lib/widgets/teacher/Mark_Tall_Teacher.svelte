<script>
	import MarkItem_Teacher from './MarkItem_Teacher.svelte';
	import MarkFormTeacher from './Mark_Form_Teacher.svelte';
	import { currentContent, currentView, userUid } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fade } from 'svelte/transition';
	import Icon from '$lib/Icon.svelte';
	import { writable } from 'svelte/store';
	export const state = writable(false);
	export const refresh = writable(false);

	let currentSemester;
	let toggleButton;

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
				if (JSON.stringify(data.mark) !== '{}') {
					// ignores unmarked exams
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

		let sortedMarks = [...marks].sort(([idA, dataA], [idB, dataB]) => {
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});
		marks = new Map(sortedMarks);
		currentSemester = 1;
	});

	function toggleNewExam() {
		state.set(!$state);
	}
</script>

<div id="container">
	<div id="top">
		<h1 class="widgetTitle">Marks</h1>
		<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	</div>

	<!-- <div id="display">
		{#key currentSemester}
			{#if currentSemester == 1}
				{#each [...marks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each}
			{/if}
			{#if currentSemester == 2}
				{#each [...marks] as [id, { date, mark, maxMark, details, name }]}
					<MarkItem {mark} {maxMark} {date} {details} {name}></MarkItem>
				{/each}
			{/if}
		{/key}
	</div> -->

	{#key currentSemester}
		<div id="display" in:fade={{ delay: 250, duration: 300 }}>
			<!-- transition foireuse sur le out -->
			{#each [...marks] as [id, { date, details, mark, maxMark, name, semester }]}
				<MarkItem_Teacher marks={mark} {maxMark} {date} {name} {semester}
				></MarkItem_Teacher>
			{/each}

			{#if $state}
				<MarkFormTeacher {refresh} {state}></MarkFormTeacher>
			{/if}
		</div>
	{/key}
	<button
		class="buttonReset addButton"
		on:click={toggleNewExam}
		bind:this={toggleButton}
		class:rotate-45deg={$state}
	>
		<Icon name={'plus-circle-dotted'} class={'s32x32'}></Icon>
	</button>
</div>

<style>
	@import '../../../global.css';

	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
		overflow-x: hidden;
		width: 100%;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#container::-webkit-scrollbar {
		display: none;
	}

	#container::-webkit-scrollbar-thumb {
		display: none;
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

	#top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 45%;
		margin-right: 5%;
	}

	#icon {
		margin-top: 5%;
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

	/* #periods {
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
	} */

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

	.addButton {
		margin: auto;
		margin-top: 1rem;
		opacity: 0.8;
		transition: all 0.5s ease;
	}

	.addButton:hover {
		opacity: 1;
	}

	.rotate-45deg {
		transform: rotate(45deg);
	}
</style>

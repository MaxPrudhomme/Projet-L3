<script>
	import ExamItem from './ExamItem.svelte';
	import ExamForm from './Exam_Form.svelte';
	import { currentContent, currentView } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs, query, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Icon from '$lib/Icon.svelte';
	import { writable } from 'svelte/store';

	export const state = writable(false); // state checks if the user request to toggle Exam_Form
	export const refresh = writable(false);

	let exam = new Map();
	let firestoreSnapshot = new Map();
	let toggleButton;
	const today = new Date().setHours(0, 0, 0, 0);

	function sortExamByDueDate(examMap) {
		// sorts a map of exams by date
		return new Map(
			[...examMap.entries()].sort((a, b) => {
				return a[1].date - b[1].date;
			})
		);
	}

	function dateToString(timestamp) {
		// returns a string with date, hours and minutes from the date put as argument
		const dateObj = timestamp.toDate();
		const day = String(dateObj.getDate()).padStart(2, '0');
		const month = String(dateObj.getMonth() + 1).padStart(2, '0');
		const year = dateObj.getFullYear();
		let hour = dateObj.getHours();
		let minutes = dateObj.getMinutes();

		if (hour < 10) hour = '0' + hour.toString();
		if (minutes < 10) minutes = '0' + minutes.toString();

		return `${day}/${month}/${year} - ${hour}:${minutes}`;
	}

	async function loadContent() {
		// fetch relevant content from backend (ie. the marks of all students from every exam)
		try {
			const courseRef = collection(db, 'courses', $currentView, 'exam');
			const q = query(courseRef, orderBy('date'));
			const querySnapshot = await getDocs(q);

			querySnapshot.forEach((doc) => {
				// add data of each exam to map
				let data = doc.data();
				// data['date'] = new Date(data['date'].seconds * 1000);
				exam.set(doc.id, data);
			});

			firestoreSnapshot = new Map(exam);

			let sorted = sortExamByDueDate(exam);
			exam = new Map(sorted);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	}

	onMount(async () => {
		// content loading done in the onMount
		await loadContent();
	});

	$: {
		if ($refresh) {
			let temp = $currentContent['exam'];
			let tempMap = new Map();
			if (temp && typeof temp === 'object') {
				Object.entries(temp).forEach(([key, value]) => {
					tempMap.set(key, value);
				});
			}
			exam = sortExamByDueDate(new Map([...tempMap, ...firestoreSnapshot]));
			refresh.set(false);
		}
	}

	function toggleNewExam() {
		// makes Exam_Form pop up
		state.set(!$state);
	}
</script>

<div id="container">
	<div id="top">
		<h1 class="widgetTitle">Exam</h1>
		<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	</div>

	<div id="examContainer">
		{#key exam}
			{#each [...exam] as [id, { date, details, name }]}
				<ExamItem date={dateToString(date)} {details} {name}></ExamItem>
				<!-- display individual exams as items -->
			{/each}

			{#if $state}
				<ExamForm {refresh} {state}></ExamForm> <!-- display form instead if requested-->
			{/if}
		{/key}
		<button
			class="buttonReset addButton"
			on:click={toggleNewExam}
			bind:this={toggleButton}
			class:rotate-45deg={$state}
		>
			<!-- button to request the form -->
			<Icon name={'plus-circle-dotted'} class={'s32x32'}></Icon>
		</button>
	</div>
</div>

<style>
	#container {
		width: 100%;
		height: 100%;
		overflow: auto;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#container::-webkit-scrollbar {
		display: none;
	}

	#container::-webkit-scrollbar-thumb {
		display: none;
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

	#examContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 10px;
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

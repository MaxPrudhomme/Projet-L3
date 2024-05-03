<script>
	import { currentContent, currentView, userUid } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Icon from '$lib/Icon.svelte';
	import ExamItem from './ExamItem.svelte';
	import ExamForm from './Exam_Form.svelte';
	import { writable } from 'svelte/store';
	export const state = writable(false);
	export const refresh = writable(false);

	let exams = new Map();
	let firestoreSnapshot = new Map();
	let today = new Date().setHours(0, 0, 0, 0);
	let toggleButton;

	function dateToString(date) {
		return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
	}

	function sortExamsByDate(examsMap) {
		return new Map(
			[...examsMap.entries()].sort((a, b) => {
				return a[1].date - b[1].date;
			})
		);
	}

	async function loadContent() {
		// loads all the already existing exams from the database and the cache
		let existingExams = $currentContent['exam'];

		if (existingExams) {
			Object.entries(existingExams).forEach(([id, item]) => {
				if (item.date.toDate().setHours(0, 0, 0, 0) < today) {
					delete existingExams[id];
				}
			});
		}

		try {
			const courseRef = collection(db, 'courses', $currentView, 'exam');
			const q = query(courseRef, orderBy('date'));
			const querySnapshot = await getDocs(q);

			querySnapshot.forEach((doc) => {
				const data = doc.data();

				data['date'] = new Date(data['date'].seconds * 1000);
				exams.set(doc.id, data);
			});

			firestoreSnapshot = new Map(exams);

			if (existingExams && typeof existingExams === 'object') {
				Object.entries(existingExams).forEach(([id, data]) => {
					exams.set(id, data);
				});
			}
			let sorted = sortExamsByDate(exams);
			exams = new Map(sorted);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	}

	onMount(async () => {
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
			exams = sortExamsByDate(new Map([...tempMap, ...firestoreSnapshot]));
			refresh.set(false);
		}
	}

	function toggleNewExam() {
		state.set(!state);
	}
</script>

<div id="container">
	<h1 class="widgetTitle">Exams</h1>
	<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	<div id="items">
		{#key exams}
			{#each [...exams] as [id, { date, details, mark, maxMark, name, semester }]}
				<ExamItem date={dateToString(date)} {name} {details} />
			{/each}

			{#if $state}
				<ExamForm {refresh} {state}></ExamForm>
			{/if}
		{/key}
		<button
			class="buttonReset addButton"
			on:click={toggleNewExam}
			bind:this={toggleButton}
			class:rotate-45deg={$state}
		>
			<Icon name="plus-circle-dotted" width="32px" height="32px" />
		</button>
	</div>
</div>

<style>
	@import '../../../global.css';

	#container {
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	#container::-webkit-scrollbar {
		display: none;
	}

	#container::-webkit-scrollbar-thumb {
		display: none;
	}

	#items {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#icon {
		position: absolute;
		left: 90%;
		top: 10px;
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

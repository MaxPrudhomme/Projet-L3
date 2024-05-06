<script>
	import ExamItem from './ExamItem.svelte';
	import ExamForm from './Exam_Form.svelte';
	import { currentContent, currentView, userUid } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Icon from '$lib/Icon.svelte';
	import { writable } from 'svelte/store';
	export const state = writable(false);
	export const refresh = writable(false);

	let exam = new Map();
	let firestoreSnapshot = new Map();
	let toggleButton;
	const today = new Date().setHours(0, 0, 0, 0);

	function sortExamByDueDate(examMap) {
		return new Map(
			[...examMap.entries()].sort((a, b) => {
				return a[1].date - b[1].date;
			})
		);
	}

	function dateToString(timestamp) {
		const dateObj = timestamp.toDate();
		const day = String(dateObj.getDate()).padStart(2, '0');
		const month = String(dateObj.getMonth() + 1).padStart(2, '0');
		const year = dateObj.getFullYear();
		return `${day}/${month}/${year}`;
	}

	async function loadContent() {
		let existingExam = $currentContent['exam'];

		if (existingExam) {
			Object.entries(existingExam).forEach(([id, item]) => {
				if (item.date.toDate().setHours(0, 0, 0, 0) < today && item.status) {
					delete existingExam[id];
				}
			});
		}

		// const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView);
		// await updateDoc(targetRef, {
		// 	exam: existingExam
		// });

		try {
			const courseRef = collection(db, 'courses', $currentView, 'exam');
			const q = query(courseRef, orderBy('date'));
			const querySnapshot = await getDocs(q);

			querySnapshot.forEach((doc) => {
				let data = doc.data();
				// data['date'] = new Date(data['date'].seconds * 1000);
				exam.set(doc.id, data);
			});

			firestoreSnapshot = new Map(exam);

			if (existingExam && typeof existingExam === 'object') {
				Object.entries(existingExam).forEach(([id, data]) => {
					exam.set(id, data);
				});
			}
			let sorted = sortExamByDueDate(exam);
			exam = new Map(sorted);
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
			exam = sortExamByDueDate(new Map([...tempMap, ...firestoreSnapshot]));
			refresh.set(false);
		}
	}

	function toggleNewExam() {
		state.set(!$state);
	}
</script>

<div id="container">
	<h1 class="widgetTitle">Exam</h1>
	<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	<div id="examContainer">
		{#key exam}
			{#each [...exam] as [id, { date, details, name }]}
				<ExamItem date={dateToString(date)} {details} {name}></ExamItem>
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

	#icon {
		position: absolute;
		left: 90%;
		top: 10px;
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

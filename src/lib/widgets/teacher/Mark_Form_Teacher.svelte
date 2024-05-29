<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView, currentContent } from '../../../store';
	import {
		collection,
		getDocs,
		query,
		orderBy,
		doc,
		updateDoc,
		getDoc
	} from 'firebase/firestore';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { parse } from 'csv';

	export let refresh;
	export let state;

	let list = [];

	const today = new Date();

	let studentsIndex;

	let exams = new Map();

	async function loadContent() {
		// fetch relevant content and data from backend (ie. the marks of all students from every exam)
		let existingExam = $currentContent['exam'];

		if (existingExam) {
			Object.entries(existingExam).forEach(([id, item]) => {
				if (item.date.toDate().setHours(0, 0, 0, 0) < today && item.status) {
					delete existingExam[id];
				}
			});
		}

		try {
			const courseRef = collection(db, 'courses', $currentView, 'exam');
			const q = query(courseRef, orderBy('date'));
			const querySnapshot = await getDocs(q);
			const studentRef = doc(db, 'users', 'index');
			const studentSnapshot = await getDoc(studentRef);
			studentsIndex = studentSnapshot.data(); // studentsIndex is a list of every student with their Firebase ID

			querySnapshot.forEach((doc) => {
				let data = doc.data();
				exams.set(doc.id, data);
			});

			if (existingExam && typeof existingExam === 'object') {
				Object.entries(existingExam).forEach(([id, data]) => {
					exams.set(id, data);
				});
			}
			exams = new Map(exams);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	}

	onMount(async () => {
		await loadContent();
	});


	function toggleEdit(index) {
		// toggles mark element editing
		list[index].editable = !list[index].editable;
	}

	function handleKeyDownForEdit(event, index) {
		// toggles mark editing when Enter is pressed
		if (event.key === 'Enter') {
			toggleEdit(index);
		}
	}

	function getKeyByValue(object, value) {
		// returns the key for a specific value
		return Object.keys(object).find((key) => object[key] === value);
	}

	async function submitMark() {
		// submits the inputted marks and uploads them to Firebase
		const targetRef = doc(db, 'courses', $currentView, 'exam', selectedId);
		const targetSnapshot = await getDoc(targetRef);

		let mark = new Object();
		list.forEach((item) => {
			mark[getKeyByValue(studentsIndex, item.content.name)] = item.content.mark; // assign the mark to the firebase ID of the student
		});

		await updateDoc(targetRef, { mark: mark });
		refresh.set(true);
		state.set(false);
	}

	let selectedId;
	let selectedExam;

	const onChange = (event) => {
		// changes the selected exam so the marks are uploaded to the right document
		selectedExam = exams.get(event.target.value);
		list = []; // temporary : empties list, so unsaved changes are lost, yeah it's bad
		for (const [key, value] of Object.entries(selectedExam.mark)) {
			list.push({
				content: {
					name: studentsIndex[key],
					mark: studentsIndex[value]
				},
				editable: true
			});
		}
	};
</script>

<form transition:fly={{ duration: 250, x: -300 }}>
	{#key exams}
		<div id="top">
			<button class="buttonReset" on:click={submitMark}>
				<Icon name={'check-circle'} class={'s36x36 t500'}></Icon>
			</button>
			<select name="examSelect" id="examSelect" on:change={onChange} bind:value={selectedId}>
				{#each [...exams] as [id, { name }]}
					<option value={id}>{name}</option>
				{/each}
			</select>
		</div>
		<ul>
			<!-- List items will be dynamically added here -->
			{#each list as mark, index}
				<li>
					{#if mark.editable}
						<div class="flexRow">
							<p>{mark.content.name}</p>
							<input
								type="number"
								max="100"
								min="0"
								bind:value={mark.content.mark}
								class="inputReset numberInput"
								on:blur={() => toggleEdit(index)}
							/>
						</div>
					{:else}
						<p>{mark.content.name}</p>
						<span
							role="button"
							on:click={() => toggleEdit(index)}
							on:keydown={(event) => handleKeyDownForEdit(event, index)}
							tabindex="0">{mark.content.mark}</span
						>
					{/if}
				</li>
			{/each}
		</ul>
	{/key}
</form>

<style>
	form {
		position: absolute;
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 80%;
		margin: auto;
		margin-top: 10px;
		padding: 10px;
		transition: all 0.5s ease;
		height: 85%;
	}

	#top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.numberInput {
		width: 10%;
		background-color: rgb(0, 0, 0, 0.5);
		border-radius: 3px;
		padding: 3px;
	}

	select {
		width: 70%;
		text-align-last: center;
	}

	ul {
		margin-top: 0.3rem;
		margin-left: 2rem;
	}

	li {
		width: 90%;
		overflow-wrap: break-word;
	}

	li > * {
		vertical-align: text-top;
	}

	li:hover {
		cursor: text;
	}

	/* REMOVE ARROWS FROM NUMBER INPUT */
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		/* ignore error */
		-moz-appearance: textfield;
	}
</style>

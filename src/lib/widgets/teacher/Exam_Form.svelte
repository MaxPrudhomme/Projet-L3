<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView } from '../../../store';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { v4 } from 'uuid'; // v4() generates a 20 characters alphanumeric id
	import { Timestamp } from 'firebase/firestore';
	import { fly } from 'svelte/transition';

	export let refresh;
	export let state;

	// input values
	let details;
	let name;
	let dueDate;

	// input fields
	let detailsInput;
	let nameInput;

	// input containers
	let detailsContainer;
	let nameContainer;

	const today = new Date();

	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();


	function adjustTextareaHeight(event) {
		// function to dynamically adjust the height of a textarea depending on the amount of text within
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	async function submitExam() {
		// checks if all the inputs are correct and sends the data to Firebase if so
		if (!dueDate) {
			alert('Please select a due date.');
			return;
		}

		if (detailsInput.value.trim() !== '') {
			details = { content: detailsInput.value.trim(), editable: false };
			detailsContainer.style.display = 'none';
		}

		if (nameInput.value.trim() !== '') {
			name = { content: nameInput.value.trim(), editable: false };
			nameContainer.style.display = 'none';
		}

		if (details.length === 0 || !details.content.trim()) {
			alert('Please add details.');
			return;
		}

		if (name.length === 0 || !name.content.trim()) {
			alert('Please add a name.');
			return;
		}


		const targetRef = doc(db, 'courses', $currentView, 'exam', v4());
		const courseRef = doc(db, 'courses', $currentView);
		let courseSnapshot = await getDoc(courseRef);
		let courseData = courseSnapshot.data();

		let studentsBase = {};
		// pregenerates placeholder values for the students' marks
		for (let i = 0; i < courseData.students.length; i++) {
			let path = courseData.students[i].path.substr(6);
			studentsBase[path] = 0;
		}

		const newExam = {
			// proper complete exam object to be sent to Firebase
			date: Timestamp.fromDate(new Date(dueDate)),
			details: details.content,
			mark: studentsBase,
			maxMark: 100,
			name: name.content,
			semester: 2 // placeholder value
		};

		await setDoc(targetRef, newExam);
		refresh.set(true);
		state.set(false);
	}
</script>

<form transition:fly={{ duration: 250, x: -300 }}>
	<div id="top">
		<button class="buttonReset" on:click={submitExam}>
			<Icon name={'check-circle'} class={'s36x36 t500'}></Icon>
		</button>

		<div id="dueInput">
			<input
				class="dueText inputReset"
				type="datetime-local"
				min={`${year}-${month}-${day}`}
				bind:value={dueDate}
			/>
		</div>
	</div>
	<div id="name" bind:this={nameContainer}>
		<textarea
			rows="1"
			bind:this={nameInput}
			class="inputReset"
			placeholder="Add a name"
			on:input={adjustTextareaHeight}
		></textarea>
	</div>
	<div id="details" bind:this={detailsContainer}>
		<textarea
			bind:this={detailsInput}
			class="inputReset"
			placeholder="Add details"
			on:input={adjustTextareaHeight}
		></textarea>
	</div>
	<p id="givenDate">{`${day}/${month}/${year}`}</p>
</form>

<style>
	form {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 80%;
		margin: auto;
		margin-top: 10px;
		padding: 10px;
		transition: all 0.5s ease;
		height: auto;
	}

	#top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	.dueText {
		font-size: 1.3rem;
		margin-top: 0.2rem;
		height: 1.5rem;
		transition: all 0.15s ease;
	}

	#details,
	#name {
		margin-top: 0.3rem;
		margin-left: auto;
		margin-right: auto;
	}

	textarea {
		width: 100%;
		overflow-wrap: break-word;
		border: 2px dotted;
		border-color: rgb(0, 0, 0, 0.5);
		border-radius: 5px;
		resize: none;
		overflow-y: hidden;
	}

	#name > textarea {
		font-size: x-large;
	}

	#details > textarea {
		font-size: large;
	}

	textarea:hover {
		cursor: text;
	}

	#givenDate {
		text-align: right;
		color: rgba(0, 0, 0, 0.7);
	}
</style>

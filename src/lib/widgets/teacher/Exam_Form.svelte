<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView, currentContent, userUid } from '../../../store';
	import { doc, updateDoc } from 'firebase/firestore';
	import { v4 } from 'uuid';
	import { Timestamp } from 'firebase/firestore';
	import { fly } from 'svelte/transition';

	export let refresh;
	export let state;

	let details;
	let name;
	let date;
	let detailsInput;
	let nameInput;
	let detailsContainer;
	let nameContainer;

	const today = new Date();

	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (nameInput.value.trim() !== '') {
				const content = nameInput.value.trim();
				details = { content, editable: false };
				nameInput.value = '';
				nameInput.focus();
			}
			if (detailsInput.value.trim() !== '') {
				const content = detailsInput.value.trim();
				details = { content, editable: false };
				detailsInput.value = '';
				detailsInput.focus();
			}
		}
	}

	function toggleEdit(index) {
		details.editable = !details.editable;
	}

	function handleKeyDownForEdit(event, index) {
		if (event.key === 'Enter') {
			toggleEdit(index);
		}
	}

	function adjustTextareaHeight(event) {
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	async function submitHomework() {
		if (!date) {
			alert('Please select a due date.');
			return;
		}

		if (nameInput.value.trim() !== '') {
			name = { content: nameInput.value.trim(), editable: false };
			nameInput.style.display = 'none';
		}
		if (detailsInput.value.trim() !== '') {
			details = { content: detailsInput.value.trim(), editable: false };
			detailsInput.style.display = 'none';
		}

		if (name.length === 0) {
			alert('Please add a name.');
			return;
		}
		if (details.length === 0) {
			alert('Please add details.');
			return;
		}

		const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView);

		const newExam = {
			date: Timestamp.fromDate(new Date(date)),
			name: name.content,
			details: details.content,
			mark: new Map(),
			maxMark: 100,
			semester: 2 // temporary
		};

		const examId = v4();

		await updateDoc(targetRef, {
			[`exam.${examId}`]: newExam
		});
		refresh.set(true);
		state.set(false);

		currentContent.update((content) => {
			if (!content.exam || typeof content.exam !== 'object') {
				content.exam = {};
			}
			content.exam[examId] = newExam;
			return content;
		});
	}
</script>

<form transition:fly={{ duration: 250, x: -300 }}>
	<div id="dueInput">
		<button class="buttonReset" on:click={submitHomework}>
			<Icon name={'check-circle'} class={'s36x36 t500'}></Icon>
		</button>
		<p class="dueText" id="dueLabel">due</p>
		<input
			class="dueText inputReset"
			type="date"
			min={`${year}-${month}-${day}`}
			bind:value={date}
		/>
	</div>
	<div id="name-input" bind:this={nameContainer}>
		<textarea
			bind:this={nameInput}
			class="inputReset"
			placeholder="Add a name"
			on:keydown={handleKeyDown}
			on:input={adjustTextareaHeight}
		></textarea>
	</div>
	<div id="details-input" bind:this={detailsContainer}>
		<textarea
			bind:this={detailsInput}
			class="inputReset"
			placeholder="Add details"
			on:keydown={handleKeyDown}
			on:input={adjustTextareaHeight}
		></textarea>
	</div>
	<p id="givenDate">given {`${day}/${month}/${year}`}</p>
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

	#dueInput {
		display: flex;
	}

	.dueText {
		font-size: 1.3rem;
		margin-top: 0.2rem;
		height: 1.5rem;
		transition: all 0.15s ease;
	}

	#dueLabel {
		margin-left: 0.5rem;
		margin-right: 0.2rem;
	}

	#details-input {
		margin-top: 0.3rem;
		margin-left: 2rem;
		width: 90%;
		overflow-wrap: break-word;
	}

	#details-input > * {
		vertical-align: text-top;
	}

	#details-input:hover {
		cursor: text;
	}

	textarea {
		resize: none;
		overflow-y: hidden;
		overflow-wrap: break-word;
		width: 100%;
	}

	#givenDate {
		text-align: right;
		color: rgba(0, 0, 0, 0.7);
	}
</style>

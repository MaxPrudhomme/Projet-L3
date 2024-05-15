<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView, currentContent, userUid } from '../../../store';
	import {
		collection,
		getDocs,
		query,
		orderBy,
		doc,
		updateDoc,
		setDoc,
		getDoc
	} from 'firebase/firestore';
	import { v4 } from 'uuid';
	import { Timestamp } from 'firebase/firestore';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { parse } from 'csv';

	let list = [];
	let date;
	let nameInput;
	let detailsInput;
	let locationInput;

	const today = new Date();

	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();

	let studentsIndex;

	let courses = new Map();

	async function loadContent() {
		try {
			const courseRef = collection(db, 'users', $userUid, 'userCourses');
			const courseSnapshot = await getDocs(courseRef);
			const studentRef = doc(db, 'users', 'index');
			const studentSnapshot = await getDoc(studentRef);
			studentsIndex = studentSnapshot.data();

			courseSnapshot.forEach((doc) => {
				let data = doc.data();
				// data['date'] = new Date(data['date'].seconds * 1000);
				courses.set(doc.id, data.tag);
			});

			courses = new Map(courses);
			console.log(courses);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	}

	onMount(async () => {
		await loadContent();
	});

	// function handleKeyDown(event) {
	// 	if (event.key === 'Enter') {
	// 		event.preventDefault();
	// 		if (markInput.value.trim() !== '') {
	// 			const content = markInput.value.trim();
	// 			list = [...list, { content, editable: false }];
	// 			markInput.value = '';
	// 			markInput.focus();
	// 		}
	// 	}
	// }

	const processFile = async () => {
		const records = [];
		const parser = fs.createReadStream(`${__dirname}/fs_read.csv`).pipe(
			// REPLACE BY FILE UPLOADED
			parse({
				// CSV options if any
			})
		);
		for await (const record of parser) {
			// Work with each record
			records.push(record);
		}
		return records;
	};

	function adjustTextareaHeight(event) {
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	async function submitSchedule() {
		// if (markInput.value !== null) {
		// 	list = [...list, { content: markInput.value.trim(), editable: false }];
		// 	markContainer.style.display = 'none';
		// }

		const targetRef = doc(db, 'courses', $currentView, 'exam', selectedId);
		const targetSnapshot = await getDoc(targetRef);

		await updateDoc(targetRef, { mark: mark });

		// currentContent.update((content) => {
		// 	if (!content.mark || typeof content.mark !== 'object') {
		// 		content.mark = {};
		// 	}
		// 	content.mark[markId] = mark;
		// 	return content;
		// });
	}

	let selectedId;
	let selectedCourse;

	const onChange = (event) => {
		selectedCourse = courses.get(event.target.value);
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
	<div id="topLabel">
		<h1 class="widgetTitle">Schedule Form</h1>
		<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	</div>
	{#key courses}
		<div id="top">
			<button class="buttonReset" on:click={submitSchedule}>
				<Icon name={'check-circle'} class={'s36x36 t500'}></Icon>
			</button>
			<select name="examSelect" id="examSelect" on:change={onChange} bind:value={selectedId}>
				{#each [...courses] as [id, tag]}
					<option value={id}>{tag}</option>
				{/each}
			</select>
		</div>

		<div id="date-selection">
			<label for="start-date">Start : </label>
			<input type="datetime" name="start-date" id="start-date" />
			<label for="end-date">End : </label>
			<input type="datetime" name="end-date" id="end-date" />
		</div>
		<div>
			<label for="name-input">Name : </label>
			<textarea
				bind:value={nameInput}
				class="inputReset"
				name="name-input"
				on:input={adjustTextareaHeight}
			></textarea>
			<label for="details-input">Details : </label>
			<textarea
				bind:value={detailsInput}
				class="inputReset"
				name="details-input"
				on:input={adjustTextareaHeight}
			></textarea>
			<label for="location-input">Location : </label>
			<textarea
				bind:value={locationInput}
				class="inputReset"
				name="location-input"
				on:input={adjustTextareaHeight}
			></textarea>
		</div>
	{/key}
</form>

<style>
	form {
		position: absolute;
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 100%;
		margin: auto;
		padding: 10px;
		padding-right: 5%;
		transition: all 0.5s ease;
		height: 100%;
	}

	#top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	#topLabel {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 40%;
		margin-right: 5%;
	}

	#icon {
		margin-top: 3%;
	}

	#date-selection {
		margin-top: 3%;
	}

	.numberInput {
		width: 10%;
		background-color: rgb(0, 0, 0, 0.5);
		border-radius: 3px;
		padding: 3px;
	}

	select {
		width: 50%;
		text-align-last: center;
	}

	label {
		font-size: large;
	}

	/* .dueText {
		font-size: 1.3rem;
		margin-top: 0.2rem;
		height: 1.5rem;
		transition: all 0.15s ease;
	}

	#dueLabel {
		margin-left: 0.5rem;
		margin-right: 0.2rem;
	} */

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

	textarea {
		resize: none;
		overflow-y: hidden;
		overflow-wrap: break-word;
		width: 100%;
		background-color: rgb(255, 255, 255, 0.5);
	}

	/* REMOVE ARROWS FROM NUMBER INPUT */
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	/* input[type='number'] {
		-moz-appearance: textfield;
	} */
</style>

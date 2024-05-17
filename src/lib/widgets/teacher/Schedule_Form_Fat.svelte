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
	import { insertdb, updatedb, querydb } from '$lib/function';

	let list = [];
	let date;
	let nameInput;
	let detailsInput;
	let locationInput;
	let startDateInput;
	let endDateInput;

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

	function emptyForm() {}

	async function submitSchedule() {
		// if (markInput.value !== null) {
		// 	list = [...list, { content: markInput.value.trim(), editable: false }];
		// 	markContainer.style.display = 'none';
		// }

		if (!startDateInputDate) {
			alert('Please select a start date and time.');
			return;
		}
		if (!endDateInputDate) {
			alert('Please select an end date and time.');
			return;
		}
		if (!ID) {
			alert('Please select a course to add an event to.');
			return;
		}

		let nameValue = '';
		let detailsValue = '';
		let locationValue = '';

		if (nameInput.value.trim() !== '') {
			nameValue = nameInput.value.trim();
		}
		if (detailsInput.value.trim() !== '') {
			detailsValue = detailsInput.value.trim();
		}
		if (locationInput.value.trim() !== '') {
			locationValue = locationInput.value.trim();
		}

		let startDate = new Date(startDateInput);
		let endDate = new Date(endDateInput);

		const newScheduleItem = {
			summary: nameValue,
			description: detailsValue,
			location: locationValue,
			startDate: startDate,
			endDate: endDate,
			IDcourse: ID
		};

		// TODOTODO : check if scheduleItem already exists, if so do an update not an insert
		insertdb([newScheduleItem]);

		// const targetRef = doc(db, 'courses', $currentView, 'exam', selectedId);
		// const targetSnapshot = await getDoc(targetRef);

		// await updateDoc(targetRef, { mark: mark });

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
	let ID;

	const onChange = (event) => {
		selectedCourse = courses.get(event.target.value);
		ID = event.target.value;
		console.log(ID);
		// list = []; // temporary : empties list, so unsaved changes are lost, yeah it's bad
		// for (const [key, value] of Object.entries(selectedExam.mark)) {
		// 	list.push({
		// 		content: {
		// 			name: studentsIndex[key],
		// 			mark: studentsIndex[value]
		// 		},
		// 		editable: true
		// 	});
		// }
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
			<input
				bind:value={startDateInput}
				type="datetime-local"
				name="start-date"
				id="start-date"
				class="inputReset"
			/>
			<span style="width: 10%;"></span>
			<label for="end-date">End : </label>
			<input
				bind:value={endDateInput}
				type="datetime-local"
				name="end-date"
				id="end-date"
				class="inputReset"
			/>
		</div>
		<div id="main-inputs">
			<label for="name-input">Name : </label>
			<textarea bind:value={nameInput} class="inputReset" name="name-input" id="name-input"
			></textarea><br />
			<label for="details-input">Details : </label>
			<textarea
				bind:value={detailsInput}
				class="inputReset"
				name="details-input"
				on:input={adjustTextareaHeight}
			></textarea><br />
			<label for="location-input">Location : </label>
			<textarea
				bind:value={locationInput}
				class="inputReset"
				name="location-input"
				on:input={adjustTextareaHeight}
			></textarea>
		</div>
		<!-- <input type="file" name="csv-input" id="csv-input"> GESTION DE CSV A FAIRE APRES AVOIR REMIS GITHUB BIEN  -->
	{/key}
	<button class="buttonReset" id="cancelButton" on:click={emptyForm}>
		<Icon name={'plus-circle-dotted'} class={'s36x36 t500'}></Icon>
	</button>
</form>

<style>
	form {
		position: absolute;
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 100%;
		padding: 10px;
		padding-right: 5%;
		transition: all 0.5s ease;
		height: 100%;
	}

	#topLabel {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 40%;
		margin-right: 5%;
	}

	#top {
		display: flex;
		flex-direction: row;
	}

	#top > button {
		margin-right: 60%;
	}

	#main-inputs {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#icon {
		margin-top: 3%;
	}

	#date-selection {
		margin-top: 3%;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	#date-selection > * {
		margin-right: 1%;
		border-radius: 10px;
	}

	#start-date,
	#end-date {
		background-color: rgb(255, 255, 255, 0.5);
	}

	#name-input {
		font-size: large;
		font-weight: bold;
		height: 1.5rem;
	}

	/* .numberInput {
		width: 10%;
		background-color: rgb(0, 0, 0, 0.5);
		border-radius: 3px;
		padding: 3px;
	} */

	select {
		width: 30%;
		text-align-last: center;
	}

	label {
		font-size: large;
		margin-top: 1rem;
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

	/* ul {
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
	} */

	textarea {
		resize: none;
		overflow-y: hidden;
		overflow-wrap: break-word;
		width: 95%;
		background-color: rgb(255, 255, 255, 0.5);
		margin-bottom: 1rem;
		border-radius: 10px;
		margin-right: 3%;
		padding: 0.3rem;
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

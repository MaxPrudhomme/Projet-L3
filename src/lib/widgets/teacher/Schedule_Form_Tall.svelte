<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { userUid } from '../../../store';
	import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { parse } from 'csv';
	import { insertdb, updatedb, querydb } from '$lib/function';

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
		// fetch relevant content from backend (ie. the marks of all students from every exam)
		try {
			const courseRef = collection(db, 'users', $userUid, 'userCourses');
			const courseSnapshot = await getDocs(courseRef);

			const studentRef = doc(db, 'users', 'index');
			const studentSnapshot = await getDoc(studentRef);
			studentsIndex = studentSnapshot.data(); // list of students and their IDs

			courseSnapshot.forEach((doc) => {
				let data = doc.data();
				// data['date'] = new Date(data['date'].seconds * 1000);
				courses.set(doc.id, data.tag);
			});

			courses = new Map(courses);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	}

	onMount(async () => {
		// content loading done in the onMount
		await loadContent();
	});

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
		// function to dynamically adjust the height of a textarea depending on the amount of text within
		const textarea = event.target;
		textarea.style.height = 'auto';
		textarea.style.height = `${textarea.scrollHeight}px`;
	}

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	// input fields variables
	let nameField;
	let detailsField;
	let startDateField;
	let endDateField;
	let locationField;

	function emptyForm() {
		// empties form inputs
		nameField.value = '';
		detailsField.value = '';
		startDateField.value = '';
		endDateField.value = '';
		locationField.value = '';
	}

	async function submitSchedule() {
		// checks if all the inputs are correct and sends the data to Firebase if so

		// check if minimum necessary content is filled
		if (!startDateInput) {
			alert('Please select a start date and time.');
			return;
		}
		if (!endDateInput) {
			alert('Please select an end date and time.');
			return;
		}
		if (!ID) {
			alert('Please select a course to add an event to.');
			return;
		}

		// puts text inputs values in strings
		let nameValue = '';
		let detailsValue = '';
		let locationValue = '';

		if (nameField.value.trim() !== '') {
			nameValue = nameField.value.trim();
		}
		if (detailsField.value.trim() !== '') {
			detailsValue = detailsField.value.trim();
		}
		if (locationField.value.trim() !== '') {
			locationValue = locationField.value.trim();
		}

		// checks if dates are in the right order and that the length of the item is larger than 0
		let startDate = new Date(startDateInput);
		let endDate = new Date(endDateInput);

		if (startDate > endDate) {
			alert('The end date and time cannot come before the start date and time.');
			return;
		} else if (startDate == endDate) {
			alert('The start and end dates and times cannot be identical.');
			return;
		}

		// creates proper item to send to backend
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

		emptyForm(); // empties form after finishing
	}

	let selectedId;
	let selectedCourse;
	let ID;

	const onChange = (event) => {
		// sets in ID which course is selected to add an item to
		selectedCourse = courses.get(event.target.value);
		ID = event.target.value;
	};
</script>

<form transition:fly={{ duration: 250, x: -300 }}>
	<div id="topLabel" class="flexRow">
		<h1 class="widgetTitle">Schedule Form</h1>
		<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	</div>

	{#key courses}
		<div id="top" class="simpleFlexRow">
			<button class="buttonReset" on:click={submitSchedule}>
				<Icon name={'check-circle'} class={'s36x36 t500'}></Icon>
			</button>
			<select name="examSelect" id="examSelect" on:change={onChange} bind:value={selectedId}>
				<!-- selection of the course -->
				{#each [...courses] as [id, tag]}
					<option value={id}>{tag}</option>
				{/each}
			</select>
		</div>

		<div id="main-inputs">
			<!-- selection of the dates -->
			<label for="start-date">Start : </label>
			<input
				bind:value={startDateInput}
				bind:this={startDateField}
				type="datetime-local"
				name="start-date"
				id="start-date"
				class="inputReset"
			/>
			<span style="width: 10%;"></span>
			<label for="end-date">End : </label>
			<input
				bind:value={endDateInput}
				bind:this={endDateField}
				type="datetime-local"
				name="end-date"
				id="end-date"
				class="inputReset"
			/>
			<!-- --------------------- -->

			<!-- name, details and location inputs -->
			<label for="name-input">Name : </label>
			<textarea
				bind:value={nameInput}
				class="inputReset"
				name="name-input"
				id="name-input"
				bind:this={nameField}
			></textarea><br />
			<label for="details-input">Details : </label>
			<textarea
				bind:value={detailsInput}
				bind:this={detailsField}
				class="inputReset"
				name="details-input"
				on:input={adjustTextareaHeight}
			></textarea><br />
			<label for="location-input">Location : </label>
			<textarea
				bind:value={locationInput}
				bind:this={locationField}
				class="inputReset"
				name="location-input"
				id="location-input"
			></textarea>
		</div>
		<!-- <input type="file" name="csv-input" id="csv-input"> GESTION DE CSV A FAIRE APRES AVOIR REMIS GITHUB BIEN  -->
	{/key}

	<button class="buttonReset" id="cancelButton" on:click={emptyForm}>
		<!-- reset button -->
		<Icon name={'plus-circle-dotted'} class={'s36x36 t500'}></Icon>
	</button>
</form>

<style>
	@import '../../../global.css';

	form {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 100%;
		padding: 10px;
		transition: all 0.5s ease;
		height: 100%;

		display: flex;
		flex-direction: column;
	}

	#topLabel {
		margin-left: 30%;
		margin-right: 5%;
	}

	#top {
		margin-top: 1rem;
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

	#start-date,
	#end-date {
		background-color: rgb(255, 255, 255, 0.5);
	}

	#name-input {
		font-size: large;
		font-weight: bold;
		height: 1.5rem;
	}

	#location-input {
		height: 1.5rem;
	}

	#cancelButton {
		align-self: center;
		transform: rotate(45deg);
	}

	select {
		width: 25%;
		text-align-last: center;
	}

	label {
		font-size: large;
		margin-top: 1rem;
	}

	textarea {
		resize: none;
		overflow-y: hidden;
		overflow-wrap: break-word;
		width: 90%;
		background-color: rgb(255, 255, 255, 0.5);
		margin-bottom: 1rem;
		border-radius: 10px;
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

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

	export let refresh;
	export let state;

	let list = [];
	let date;
	let markInput;
	let markContainer;

	const today = new Date();

	const day = String(today.getDate()).padStart(2, '0');
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const year = today.getFullYear();

	let studentsIndex;

	let exams = new Map();

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
			const studentRef = doc(db, 'users', 'index');
			const studentSnapshot = await getDoc(studentRef);
			studentsIndex = studentSnapshot.data();

			querySnapshot.forEach((doc) => {
				let data = doc.data();
				// data['date'] = new Date(data['date'].seconds * 1000);
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

	function toggleEdit(index) {
		list[index].editable = !list[index].editable;
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

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	async function submitMark() {
		// if (markInput.value !== null) {
		// 	list = [...list, { content: markInput.value.trim(), editable: false }];
		// 	markContainer.style.display = 'none';
		// }

		const targetRef = doc(db, 'courses', $currentView, 'exam', selectedId);
		const targetSnapshot = await getDoc(targetRef);

		let mark = new Object();
		list.forEach((item) => {
			mark[getKeyByValue(studentsIndex, item.content.name)] = item.content.mark;
		});
		console.log(mark);
		console.log(studentsIndex);

		await updateDoc(targetRef, { mark: mark });
		refresh.set(true);
		state.set(false);

		// currentContent.update((content) => {
		// 	if (!content.mark || typeof content.mark !== 'object') {
		// 		content.mark = {};
		// 	}
		// 	content.mark[markId] = mark;
		// 	return content;
		// });
	}

	let selectedId;
	let selectedExam;

	const onChange = (event) => {
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
			<!-- <li bind:this={markContainer}>
				<textarea
					bind:this={markInput}
					class="inputReset"
					placeholder="Add a mark"
					on:keydown={handleKeyDown}
					on:input={adjustTextareaHeight}
				></textarea>
			</li> -->
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

	/* textarea {
		resize: none;
		overflow-y: hidden;
		overflow-wrap: break-word;
		width: 100%;
	} */

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

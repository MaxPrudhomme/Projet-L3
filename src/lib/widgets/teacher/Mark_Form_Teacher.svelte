<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView, currentContent, userUid } from '../../../store';
	import { doc, updateDoc, setDoc } from 'firebase/firestore';
	import { v4 } from 'uuid';
	import { Timestamp } from 'firebase/firestore';
	import { fly } from 'svelte/transition';

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

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (markInput.value.trim() !== '') {
				const content = markInput.value.trim();
				list = [...list, { content, editable: false }];
				markInput.value = '';
				markInput.focus();
			}
		}
	}

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

	function makeid() {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let counter = 0;
		while (counter < 20) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
			counter += 1;
		}
		return result;
	}

	async function submitMark() {
		if (!date) {
			alert('Please select a due date.');
			return;
		}

		if (markInput.value.trim() !== '') {
			list = [...list, { content: markInput.value.trim(), editable: false }];
			markContainer.style.display = 'none';
		}

		if (list.length === 0 || list.every((mark) => !mark.content.trim())) {
			alert('Please add at least one mark.');
			return;
		}

		const targetRef = doc(db, 'courses', $currentView, 'exam', makeid());

		const marks = list.map((mark) => mark.content);

		const newMark = {
			date: Timestamp.fromDate(new Date(date)),
			mark: marks
		};

		const markId = v4();

		await setDoc(targetRef, newMark);
		refresh.set(true);
		state.set(false);

		currentContent.update((content) => {
			if (!content.mark || typeof content.mark !== 'object') {
				content.mark = {};
			}
			content.mark[markId] = newMark;
			return content;
		});
	}
</script>

<form transition:fly={{ duration: 250, x: -300 }}>
	<div id="dueInput">
		<button class="buttonReset" on:click={submitMark}>
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
	<ul>
		<!-- List items will be dynamically added here -->
		{#each list as mark, index}
			<li>
				{#if mark.editable}
					<textarea
						bind:value={mark.content}
						class="inputReset"
						on:blur={() => toggleEdit(index)}
						on:input={adjustTextareaHeight}
					></textarea>
				{:else}
					<span
						role="button"
						on:click={() => toggleEdit(index)}
						on:keydown={(event) => handleKeyDownForEdit(event, index)}
						tabindex="0">{mark.content}</span
					>
				{/if}
			</li>
		{/each}
		<li bind:this={markContainer}>
			<textarea
				bind:this={markInput}
				class="inputReset"
				placeholder="Add a mark"
				on:keydown={handleKeyDown}
				on:input={adjustTextareaHeight}
			></textarea>
		</li>
	</ul>
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
	}

	#givenDate {
		text-align: right;
		color: rgba(0, 0, 0, 0.7);
	}
</style>

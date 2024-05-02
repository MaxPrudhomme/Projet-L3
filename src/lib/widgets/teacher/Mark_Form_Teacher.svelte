<script>
	import { currentContent, currentView, userUid } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fade } from 'svelte/transition';
	import Icon from '$lib/Icon.svelte';

	const today = new Date();

	let nameInput;
	let nameContainer;

	function parseMarksCSV(event) {
		const file = event.target.files[0];

		if (!file.name || !file.type || !file.size) {
			console.log('ERROR : file not supported');
			return;
		}

		const reader = new FileReader();

		reader.onload = function (e) {
			const text = e.target.result;
			const lines = text.split('\\n');
			lines.forEach((line) => {
				const columns = line.split(',');
				// Handle the columns array
			});
		};

		reader.readAsText(file);
	}

	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (nameInput.value.trim() !== '') {
				const content = nameInput.value.trim();
				details = { content, editable: false };
				nameInput.value = '';
				nameInput.focus();
			}
		}
	}

	let students = [];

	// onMount(async () => {
	// 	let examRef = doc(db, 'courses', $currentView);
	// 	let examSnapshot = await getDoc(examRef);

	//     examSnapshot.data().students
	// });
</script>

<div class="containerDefault container">
	<form>
		<textarea
			bind:this={nameInput}
			class="inputReset"
			placeholder="Add a name"
			on:keydown={handleKeyDown}
		></textarea>
	</form>
</div>

<style>
	@import '../../../global.css';

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
</style>

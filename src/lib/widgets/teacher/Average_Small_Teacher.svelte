<script>
	import Icon from '$lib/Icon.svelte';
	import { db } from '$lib/firebase';
	import { currentView, currentContent, userUid } from '../../../store';
	import { doc, getDocs, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';

	let courseAverage;
	let averages = [];
	let maxMark = 100;

	async function loadContent() {
		// fetch relevant content from backend (ie. the marks of all students from every exam)

		try {
			let examRef = collection(db, 'courses', $currentView, 'exam');
			let examSnapshot = await getDocs(examRef);

			examSnapshot.forEach((doc) => {
				// loops through every exam to add the students' marks to the average
				const data = doc.data();
				if (JSON.stringify(data.mark) !== '{}') {
					let average = 0;
					let counter = 0;
					Object.entries(data.mark).forEach(([id, item]) => {
						average += (item / data.maxMark) * maxMark; // standardise the mark to be out of 100
						counter++;
					});
					average /= counter;
					if (average != 0) {
						// to skip unmarked exams
						averages.push(average);
					}
				}
			});
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		courseAverage = Math.floor(
			averages.reduce((accumulator, currentValue) => {
				return accumulator + currentValue;
			}, 0) / averages.length
		);
	}

	onMount(async () => {
		// content loading done in the onMount
		await loadContent();
	});
</script>

<div class="containerDefault container">
	<h1 class="widgetTitle">Average</h1>
	<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	<div id="content">
		{#if !courseAverage}
			<h1 id="average">X</h1>
		{:else}
			<h1 id="average">{courseAverage}</h1>
		{/if}
		<p id="out-of">/100</p>
	</div>
</div>

<style>
	@import '../../../global.css';

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10%;
	}

	#icon {
		position: absolute;
		left: 80%;
		top: 10px;
	}

	#average {
		text-align: center;
		margin-top: auto;
		font-size: 6.5rem;
		font-weight: bold;
		margin-top: -5%;
	}

	#out-of {
		text-align: right;
		font-size: 1.5rem;
		margin-right: 10%;
		margin-top: -10%;
		color: rgb(0, 0, 0, 0.5);
	}
</style>

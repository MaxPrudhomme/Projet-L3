<script>
	import { onMount } from 'svelte';
	import { currentContent, currentView, userUid } from '../../store';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let average = 0;
	let maxScore = 100;

	onMount(async () => {
		// fetches all the user's marks on Firebase and calculate the average
		if ($currentView != 'dashboard') {
			// if widget on a specific course, only the average for this course is calculated
			let counter = 0;
			try {
				let examRef = collection(db, 'courses', $currentView, 'exam');
				let examSnapshot = await getDocs(examRef);

				examSnapshot.forEach((exam) => {
					const data = exam.data();
					if (JSON.stringify(data.mark) !== '{}') {
						if (data.mark[$userUid] != 0) {
							average += (data.mark[$userUid] / data.maxMark) * maxScore; // standardise the mark to be out of 100
							counter++;
						}
						maxScore = data.maxMark;
					}
				});
			} catch (error) {
				console.error('Error fetching documents:', error);
			}

			average /= counter;
			average = Math.floor(average);
		} else {
			// else we take the general hard-coded average
			average = $currentContent.average[0];
			maxScore = $currentContent.average[1];
		}
	});
</script>

<div id="container">
	<p class="widgetTitle">Average</p>
	{#if average}
		<p id="average">{average}</p>
	{:else}
		<p id="average">X</p>
	{/if}
	<p id="out-of">/{maxScore}</p>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
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

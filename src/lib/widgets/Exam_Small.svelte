<script>
	import { currentView } from '../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let values = {};
	let countdown = '';
	let formattedDate = {};

	function calculateCountdown(examTimestamp) {
		// calculates the time left before the next exam
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		const examDate = examTimestamp.toDate();

		const diffTime = examDate - today;
		const diffDays = diffTime / (1000 * 60 * 60 * 24);

		if (diffDays < 1 && diffDays >= 0) {
			return { value: 'Today', unit: '', plus: '' };
		} else if (diffDays < 2 && diffDays >= 1) {
			return { value: 'Tomorrow', unit: '', plus: '' };
		} else if (diffDays > 99) {
			return { value: 99, unit: 'days', plus: '+' };
		} else {
			return { value: Math.floor(diffDays), unit: 'days', plus: '' };
		}
	}

	onMount(async () => {
		// fetches the exam dates from Firebase and calculate the countdowns
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const courseRef = collection(db, 'courses', $currentView, 'exam');
			const q = query(courseRef, where('date', '>=', today), orderBy('date'), limit(1));
			const querySnapshot = await getDocs(q);

			if (!querySnapshot.empty) {
				querySnapshot.forEach((doc) => {
					values = { id: doc.id, ...doc.data() };
					countdown = calculateCountdown(values.date);
				});

				const date = values.date.toDate();

				const day = String(date.getDate()).padStart(2, '0');
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const year = date.getFullYear();

				formattedDate = `${day}/${month}/${year}`;
			}
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	});
</script>

<div id="container">
	<p class="widgetTitle">Next Exam</p>
	{#if Object.keys(values).length !== 0}
		<div id="countdown">
			<span class={countdown.unit ? 'countdown-number' : ''}>
				{countdown.value}
				{#if countdown.plus}
					<sup class="countdown-plus">{countdown.plus}</sup>
				{/if}
			</span>
			{#if countdown.unit}
				<span class="countdown-unit"> {countdown.unit}</span>
			{/if}
		</div>
		<p id="examDate">{formattedDate}</p>
	{:else}
		<div id="noExamLabel">No incoming exam</div>
	{/if}
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		height: 100%;
	}

	#countdown {
		display: flex;
		align-items: baseline;
		margin-top: 0.5rem;
	}

	.countdown-number {
		font-size: 4.5rem;
		font-weight: bold;
	}

	.countdown-unit {
		font-size: 1.5rem;
		margin-left: 0.2rem;
		font-weight: bold;
	}

	.countdown-plus {
		font-size: 2rem;
		margin: none;
		margin-left: -0.7rem;
		vertical-align: top;
	}

	#examDate {
		color: rgba(0, 0, 0, 0.5);
		font-size: 1.4rem;
		margin-top: 0.4rem;
	}

	#noExamLabel {
		font-size: 1.2rem;
		margin-top: 2.7rem;
	}
</style>

<script>
	import { fly } from 'svelte/transition';
	import { currentView, userUid } from '../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import Icon from '$lib/Icon.svelte';

	let i = 0;

	// transitions parameters
	let flyParamsIn = {
		x: 100,
		delay: 200,
		opacity: 0.5
	};
	let flyParamsOut = {
		x: -100,
		delay: 200,
		opacity: 0.5
	};

	let marks = new Map();
	let currentmark = new Object();
	onMount(async () => {
		// fetches the user's marks from the exams of the course
		try {
			let courseRef = collection(db, 'courses', $currentView, 'exam');
			let courseSnapshot = await getDocs(courseRef);
			let j = 0;

			courseSnapshot.forEach((doc) => {
				const data = doc.data();
				if (JSON.stringify(data.mark) !== '{}') {
					// minor formatting of the data for easier usage
					data['mark'] = data['mark'][$userUid]; // only the user's mark is kept
					let date = new Date(data['date'].seconds * 1000);
					data['date'] =
						date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear(); // date converted to string
					marks.set(j, data);
					j++;
				}
			});
			marks = new Map(marks);
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		// sorting of the marks by date (as they will be displayed with the most recent first)
		let sortedMarks = [...marks].sort(([idA, dataA], [idB, dataB]) => {
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});

		marks = new Map(sortedMarks);
		currentmark = marks.get(i);
	});

	// functions to swap between marks
	function nextMark(event) {
		if (i < marks.size - 1) {
			i++;
			currentmark = marks.get(i);
			flyParamsIn.x = 300;
			flyParamsOut.x = -300;
		}
	}
	function previousMark(event) {
		if (i > 0) {
			i--;
			currentmark = marks.get(i);
			flyParamsIn.x = -300;
			flyParamsOut.x = 300;
		}
	}
</script>

<div class="container">
	<h1 class="widgetTitle">Marks</h1>
	{#if marks.size !== 0}
		{#key currentmark}
			<!-- displays new mark everytime the value changes -->
			<div class="content" in:fly={flyParamsIn} out:fly={flyParamsOut}>
				<h1 id="name">{currentmark.name}</h1>
				{#if currentmark.mark}
					<h1 id="mark">{currentmark.mark}</h1>
				{:else}
					<h1 id="mark">{currentmark.mark}</h1>
				{/if}
				<p id="out-of">/{currentmark.maxMark}</p>
				<p id="date">{currentmark.date}</p>
			</div>
		{/key}
	{:else}
		<div class="content" in:fly={flyParamsIn} out:fly={flyParamsOut}>
			<h1 id="mark" style="font-size:5rem; margin-top:3%">X</h1>
		</div>
	{/if}

	<!-- buttons to switch between marks -->
	<button class="buttonReset bi-caret-left" on:click={previousMark}>
		<Icon name="arrow-left" width="16" height="16" />
	</button>
	<button class="buttonReset bi-caret-right" on:click={nextMark}>
		<Icon name="arrow-right" width="16" height="16" />
	</button>
</div>

<style>
	@import '../../global.css';

	.bi-caret-left {
		position: absolute;
		left: 5%;
		top: 50%;
	}

	.bi-caret-right {
		position: absolute;
		left: 90%;
		top: 50%;
	}

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10%;
		overflow-x: hidden;
		overflow-y: hidden;
	}

	#name {
		text-align: center;
		font-weight: lighter;
		font-size: 25px;
		margin-top: 3%;
	}

	#mark {
		text-align: center;
		margin-top: auto;
		font-size: 50px;
		justify-self: center;
	}

	#out-of {
		text-align: right;
		font-size: x-large;
		margin-right: 25%;
		margin-bottom: auto;
		margin-top: -10%;
		color: rgb(0, 0, 0, 0.5);
	}

	#date {
		text-align: center;
		vertical-align: bottom;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 4%;
		margin-bottom: 15px;
	}
</style>

<script>
	import MarkItem_Teacher from './MarkItem_Teacher.svelte';
	import MarkFormTeacher from './Mark_Form_Teacher.svelte';

	import { currentView } from '../../../store';
	import { onMount } from 'svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fade } from 'svelte/transition';
	import Icon from '$lib/Icon.svelte';
	import { writable } from 'svelte/store';

	export const state = writable(false);
	export const refresh = writable(false);

	let currentSemester;
	let toggleButton;

	export const getSchoolDataById = async (schoolDocRef) => {
		const schoolSnapshot = await getDoc(schoolDocRef);
		return schoolSnapshot.data();
	};

	let marks = new Map();
	onMount(async () => {
		// fetch relevant content from backend (ie. the marks of all students from every exam)
		try {
			let courseRef = collection(db, 'courses', $currentView, 'exam');
			let courseSnapshot = await getDocs(courseRef);

			let j = 0;
			courseSnapshot.forEach((doc) => {
				// go through each exam to assign its data to marks
				const data = doc.data();
				if (JSON.stringify(data.mark) !== '{}') {
					// ignores unmarked exams
					let date = new Date(data['date'].seconds * 1000);
					data['date'] =
						date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
					marks.set(j, data);
					j++;
				}
			});
			marks = new Map(marks); // doing this is somehow necessary for the data to properly get out of onMount
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		let sortedMarks = [...marks].sort(([idA, dataA], [idB, dataB]) => {
			// sort marks by date
			const dateA = new Date(dataA.date.seconds * 1000);
			const dateB = new Date(dataB.date.seconds * 1000);

			return dateA - dateB;
		});
		marks = new Map(sortedMarks);
		currentSemester = 1;
	});

	function toggleNewMark() {
		state.set(!$state);
	}
</script>

<div id="container">
	<div id="top">
		<h1 class="widgetTitle">Marks</h1>
		<div id="icon"><Icon name="person-workspace" width="24px" height="24px" /></div>
	</div>

	{#key currentSemester}
		<div id="display" in:fade={{ delay: 250, duration: 300 }}>
			{#if !$state}
				<!-- checks if form is requested, if not display marks normally -->
				{#each [...marks] as [id, { date, details, mark, maxMark, name, semester }]}
					<MarkItem_Teacher marks={mark} {maxMark} {date} {name} {semester}
					></MarkItem_Teacher>
				{/each}
			{:else}
				<MarkFormTeacher {refresh} {state}></MarkFormTeacher>
			{/if}
		</div>
	{/key}
	<button
		class="buttonReset addButton"
		on:click={toggleNewMark}
		bind:this={toggleButton}
		class:rotate-45deg={$state}
	>
		<Icon name={'plus-circle-dotted'} class={'s32x32'}></Icon>
	</button>
</div>

<style>
	@import '../../../global.css';

	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
		overflow-x: hidden;
		width: 100%;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#container::-webkit-scrollbar {
		display: none;
	}

	#container::-webkit-scrollbar-thumb {
		display: none;
	}

	#display {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
		align-items: center;
		height: 90%;
		transition: fadeIn 2s ease-in;
	}

	#top {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-left: 45%;
		margin-right: 5%;
	}

	#icon {
		margin-top: 5%;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 100%;
		}
	}

	@keyframes fadeOut {
		from {
			opacity: 100%;
		}
		to {
			opacity: 0;
		}
	}

	button {
		background: none;
		color: rgb(0, 0, 0, 0.5);
		background: none;
		border: 1px solid rgba(0, 0, 0, 0);
		padding: 5px;
		outline: inherit;
		/* margin-left: 15%;
		margin-right: 15%; */
		margin-bottom: 10px;
	}

	.addButton {
		margin: auto;
		margin-top: 1rem;
		opacity: 0.8;
		transition: all 0.5s ease;
	}

	.addButton:hover {
		opacity: 1;
	}

	.rotate-45deg {
		transform: rotate(45deg);
	}
</style>

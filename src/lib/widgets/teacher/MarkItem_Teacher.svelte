<script>
	import Icon from '$lib/Icon.svelte';
	import { doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { onMount } from 'svelte';

	export let marks;
	export let maxMark;
	export let date;
	export let name;
	export let semester;

	let studentNames = [];

	let up = false;
	let btn;

	let average = 0;

	let counter = 0;

	onMount(async () => {
		// calculates class average for the exam and makes a list of student-mark pairs

		let userRef = doc(db, 'users', 'index');
		let userSnapshot = await getDoc(userRef);
		let data = userSnapshot.data();

		Object.entries(marks).forEach(async ([id, mark]) => {
			average += (mark / maxMark) * 100; // standardise the mark to be out of 100
			counter++;

			try {
				studentNames.push(data[id]);
			} catch (error) {
				console.error('Error fetching documents:', error);
			}
		});
		average = Math.floor((average /= counter));
	});
</script>

{#if average != 0}
	<div id="container">
		<div id="main">
			{#key average}
				<h1 id="mark">{average}</h1>
			{/key}
			<h2>/ {maxMark}</h2>
			<button
				class="buttonReset"
				bind:this={btn}
				on:click={() => {
					if (up) {
						btn.style.transform = 'rotate(0deg)';
						btn.style.transition = 'transform 0.5s ease-in-out';
						up = false;
					} else {
						btn.style.transform = 'rotate(180deg)';
						btn.style.transition = 'transform 0.5s ease-in-out';
						up = true;
					}
				}}><Icon name="arrow-box" width="50" height="50" /></button
			>
			<!-- animated button to extend item -->
		</div>

		{#key studentNames}
			<div id="details" class="card {!up ? 'hidden' : 'visible'}">
				<p>{name}</p>
				<div class="flexRow">
					<p id="date">{date}</p>
					<p id="semester">Semester {semester}</p>
				</div>

				<div id="separator"></div>
				<p id="notes">Individual marks</p>
				<ul id="content">
					{#each Object.entries(marks) as [id, mark], index}
						<li>{studentNames[index]} : {mark} / 100</li>
					{/each}
				</ul>
			</div>
		{/key}
	</div>
{/if}

<style>
	@import '../../../global.css';
	.hidden {
		height: 0;
		transition: height 0.5s ease-in-out;
		overflow: hidden;
	}

	.visible {
		height: 150px;
		transition: height 0.5s ease-in-out;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		overflow-y: auto;
	}

	.visible::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}

	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		font-family: 'SF Pro Display';
		width: 80%;
		padding: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	#main {
		display: flex;
		flex-direction: row;
	}

	#mark {
		font-weight: bolder;
		font-size: 50px;
	}

	h2 {
		font-size: x-large;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 10%;
		margin-left: 2%;
	}

	button {
		margin-top: auto;
		margin-bottom: auto;
		margin-left: auto;
		margin-right: 5%;
	}

	p {
		color: black;
		font-size: medium;
		margin-left: 5%;
		margin-top: 5px;
		margin-bottom: 10px;
	}

	li {
		margin-left: 5%;
	}

	#date {
		font-size: larger;
		margin-top: 5px;
	}

	#semester {
		font-size: larger;
		margin-top: 5px;
		margin-right: 5%;
	}

	#notes {
		color: rgb(0, 0, 0, 0.5);
		font-size: small;
		text-decoration: underline;
	}

	#separator {
		width: 95%;
		height: 1px;
		background-color: rgb(0, 0, 0, 0.5);
		margin-left: auto;
		margin-right: auto;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	#content {
		margin-left: 15px;
	}
</style>

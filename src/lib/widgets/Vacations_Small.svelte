<script>
	import { onMount } from 'svelte';
	import { currentView, currentContent, userUid } from '../../store';
	import { doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let userSchools;
	let today = new Date();
	let diffTime;
	let diffDays;

	function dateToString(date) {
		// returns a string with date, hours and minutes from the date put as argument
		const day = String(date.getDate()).padStart(2, '0');
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	}

	onMount(async () => {
		userSchools = (await getDoc(doc(db, 'users', $userUid))).data().schools;
		let vacations = [];

		userSchools.forEach(async (schoolRef) => {
			let schoolVacations = (
				await getDoc(doc(db, 'schools', schoolRef['path'].slice(8)))
			).data().vacations;

			schoolVacations.forEach((vacation) => {
				let thisVacationDate = new Date(vacation.start.seconds * 1000);
				if (thisVacationDate > today) {
					vacations.push(new Date(vacation.start.seconds * 1000));
				}
			});
		});

		vacations.sort(function (a, b) {
			return new Date(b.date) - new Date(a.date);
		});

		let vacationsDate = await vacations[0];

		diffTime = Math.abs(vacationsDate - today);
		diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		console.log(vacations, vacationsDate);
	});
</script>

<div id="container">
	<h1 id="title">Vacations</h1>
	<div id="circle">
		<p>Vacations in</p>
		{#if diffDays > 1}
			<h1 id="time">{diffDays} days</h1>
		{/if}
		{#if diffDays == 1}
			<h1 id="time">{diffDays} day</h1>
		{/if}
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 170px;
		width: 150px;
		align-items: center;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
	}

	#title {
		text-align: center;
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	#circle {
		border: 7px solid;
		border-color: #00ffff;
		border-radius: 50%;
		text-align: center;
		height: 120px;
		width: 120px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 5%;
	}

	#time {
		font-size: 25px;
	}

	p {
		font-size: large;
	}
</style>

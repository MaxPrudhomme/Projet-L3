<script>
	// IDEA : put 5 (or 7) days of a week in horizontal scroll, with the buttons switching between weeks
	import ScheduleItem from './ScheduleItem.svelte';
	import Icon from '$lib/Icon.svelte';
	import { onMount } from 'svelte';
	import { generateICSContent, parseICSContent } from '$lib/functionics';
	import { currentView, userUid } from '../../store';
	import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	// let ICSFiles;
	// let currentICSfiles;
	// let ICSContents;
	// let icsPath = 'gs://projet-l3-88394.appspot.com/icscalendar';
	// let goodIcsPath = 'icscalendar';
	// const defaultIcsPath = 'gs://projet-l3-88394.appspot.com/icscalendar/4PSFgCCPpzaOdKChhgyG.ics';
	let events = new Map();
	let eventsArray = [];
	let todayEvents;
	let today = new Date();
	let currentDate = today;
	const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	let currentWeek = Array.from(Array(7).keys()).map((idx) => {
		// array containing all the dates of the current week
		const d = new Date();
		d.setDate(d.getDate() - d.getDay() + idx);
		return d;
	});

	function compareDatesForSorting(date1, date2) {
		return date1 - date2;
	}

	function compareDates(date1, date2) {
		// checks if two dates are on the same day
		return (
			date1.getFullYear() == date2.getFullYear() &&
			date1.getMonth() == date2.getMonth() &&
			date1.getDate() == date2.getDate()
		);
	}

	function dateToString(date) {
		return (
			weekday[date.getDay()] +
			' - ' +
			date.getDate() +
			'/' +
			date.getMonth() +
			'/' +
			date.getFullYear()
		);
	}
	let stringDates = [];
	currentWeek.forEach((day) => {
		stringDates.push(dateToString(day));
	});

	onMount(() => {
		eventsArray = parseICSContent(generateICSContent());

		eventsArray.forEach(async (event) => {
			let endDate = new Date(event.end);
			let startDate = new Date(event.start);
			event.start = startDate;
			event.end = endDate;

			Object.assign(event, { height: Math.abs(endDate - startDate) / 1000 / 360 / 2 }); // difference between startDate and endDate in milliseconds, converted to a percentage of the height of the schedule

			let begin = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8);
			Object.assign(event, { pos: Math.abs(begin - startDate) / 1000 / 360 - 6.5 }); // -7% pour compenser la hauteur du titre

			try {
				let course = doc(db, 'courses', '4PSFgCCPpzaOdKChhgyG'); // temporary
				let courseData = (await getDoc(course)).data();
				Object.assign(event, { color: courseData.color });
				Object.assign(event, { icon: courseData.icon });
			} catch (error) {
				console.error('Error fetching documents:', error);
			}

			// TODO : REWORK TO BE BETTER OPTIMIZED
		});
		console.log(eventsArray);
	});

	function nextWeek(event) {
		let newCurrentWeek = Array.from(Array(7).keys()).map((idx) => {
			// array containing all the dates of the current week
			const d = new Date(new Date(currentWeek[1].getTime() + 7 * 24 * 60 * 60 * 1000));
			d.setDate(d.getDate() - d.getDay() + idx);
			return d;
		});
		currentWeek = newCurrentWeek;
		for (let i = 0; i < currentWeek.length; i++) {
			stringDates[i] = dateToString(currentWeek[i]);
		}
	}

	function previousWeek(event) {
		let newCurrentWeek = Array.from(Array(7).keys()).map((idx) => {
			// array containing all the dates of the current week
			const d = new Date(new Date(currentWeek[1].getTime() - 7 * 24 * 60 * 60 * 1000));
			d.setDate(d.getDate() - d.getDay() + idx);
			return d;
		});
		currentWeek = newCurrentWeek;
		for (let i = 0; i < currentWeek.length; i++) {
			stringDates[i] = dateToString(newCurrentWeek[i]);
		}
	}
</script>

<div id="container">
	<div id="arrows">
		<button class="buttonReset" on:click={previousWeek}><Icon name="arrow-left" /></button>
		<button class="buttonReset" on:click={nextWeek}><Icon name="arrow-right" /></button>
	</div>
	<h1 id="title">Schedule</h1>
	{#each { length: 5 } as _, i}
		<div class="subcontainer">
			{#key stringDates}
				<p>{stringDates[i + 1]}</p>
			{/key}
			<div id="schedule">
				{#each { length: 11 } as _, i}
					<div id="separator"></div>
					<div id="hour-num">{i + 8}</div>
				{/each}

				{#key stringDates}
					{#if eventsArray}
						<!-- nécessaire pour que le widget attende que la variable icon soit proprement chargée -->

						<!-- oui c'est explosé pour l'optimisation mais c'est temporaire -->
						{#each eventsArray as event}
							{#if compareDates(event.start, currentWeek[i + 1])}
								<!-- un semaine en JS commence le dimanche, d'où le +1 -->
								<ScheduleItem
									name={event.summary}
									location={event.location}
									height={event.height + '%'}
									pos={event.pos + '%'}
									color={event.color}
									icon={event.icon}
								/>
							{/if}
						{/each}
					{/if}
				{/key}
			</div>
		</div>
		<div class="verticalseparator"></div>
	{/each}
</div>

<style>
	#container {
		display: flex;
		flex-direction: row;
		overflow-x: auto;
		overflow-y: hidden;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#container::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}

	.subcontainer {
		z-index: 1;
		position: relative;
		padding: 5px;

		margin-top: 40px;
	}

	#title {
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
		color: rgb(255, 255, 255, 0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 15px;
		margin-left: auto;
		margin-right: auto;
		position: absolute;
		z-index: 2;
		left: 50%;
	}

	#separator {
		width: 100%;
		height: 3px;
		background-color: rgb(255, 255, 255, 0.5);
		margin-left: auto;
		margin-right: auto;
	}

	.verticalseparator {
		height: 90%;
		width: 3px;
		background-color: rgb(255, 255, 255, 0.5);
		margin-left: auto;
		margin-right: auto;
		position: relative;
		z-index: 2;
	}

	#hour-num {
		font-family: Arial, Helvetica, sans-serif;
		font-size: large;
		margin-top: 5%;
		margin-bottom: 5%;
		margin-left: 2%;
		color: rgb(255, 255, 255, 0.5);
		text-align: center;
		margin-right: 90%;
	}

	#schedule {
		position: relative;
		width: 350px;
		margin-left: auto;
		margin-right: auto;
		height: 90%;
	}

	#arrows {
		position: absolute;
		top: 15px;
		width: 90%;
		margin-left: 13px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		fill: rgb(255, 255, 255, 0.5);
	}

	p {
		color: rgb(0, 0, 0, 0.5);
		text-align: center;
		margin: 2%;
		font-size: large;
		margin-bottom: 5px;
	}
</style>

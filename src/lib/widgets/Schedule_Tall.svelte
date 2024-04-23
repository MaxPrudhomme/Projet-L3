<script>
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
	let stringDate = dateToString(currentDate);

	function convertEventsArrayToMap(eventsArray) {
		// converts an array of events into a map of array with key/value for each day
		let eventsMap = new Map();

		eventsArray.forEach((event) => {
			let eventDate = dateToString(event.start);
			if (!eventsMap.has(eventDate)) eventsMap.set(eventDate, []);

			eventsMap.get(eventDate).push(event);
		});

		return eventsMap;
	}

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

		events = new Map(convertEventsArrayToMap(eventsArray));
	});

	function nextDay(event) {
		currentDate.setDate(currentDate.getDate() + 1);
		stringDate = dateToString(currentDate);
	}

	function previousDay(event) {
		currentDate.setDate(currentDate.getDate() - 1);
		stringDate = dateToString(currentDate);
	}
</script>

<div id="container">
	<h1 id="title">Schedule</h1>
	<div id="arrows">
		<button class="buttonReset" on:click={previousDay}><Icon name="arrow-left" /></button>
		<button class="buttonReset" on:click={nextDay}><Icon name="arrow-right" /></button>
	</div>
	{#key stringDate}
		<p>{stringDate}</p>
	{/key}
	<div id="schedule">
		{#each { length: 11 } as _, i}
			<div id="separator"></div>
			<div id="hour-num">{i + 8}</div>
		{/each}

		{#key stringDate}
			<!-- nécessaire pour que le widget attende que la variable icon soit proprement chargée -->

			<!-- oui c'est explosé pour l'optimisation mais c'est temporaire -->
			{#if events[stringDate]}
				{#each events[stringDate] as event}
					{#if compareDates(event.start, currentDate)}
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

<style>
	#container {
		z-index: 1;
		position: relative;
		padding: 5px;
	}

	#title {
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
		color: rgb(255, 255, 255, 0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 15px;
	}

	#separator {
		width: 100%;
		height: 3px;
		background-color: rgb(255, 255, 255, 0.5);
		margin-left: auto;
		margin-right: auto;
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

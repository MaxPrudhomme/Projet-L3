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
	});

	events = new Map(convertEventsArrayToMap(eventsArray));

	function nextHour(event) {
		i++;
	}

	function previousHour(event) {
		i--;
	}

	let i;
</script>

<div id="container">
	<h1 id="title">Schedule</h1>
	{#key i}
		<div id="schedule">
			<div id="separator"></div>
			<div id="hour-num">{i + 8}</div>
			<div id="separator"></div>
			<div id="hour-num">{i + 9}</div>
			{#each hours as hour, j}
				{#if hour == i + 8}
					<ScheduleItem
						name={events[stringDate].summary}
						location={events[stringDate].location}
						height={events[stringDate].height + '%'}
						pos={events[stringDate].pos + '%'}
						color={events[stringDate].color}
						icon={events[stringDate].icon}
					></ScheduleItem>
				{/if}
			{/each}
			<!-- paramètres à remplir avec les données du backend -->
		</div>
	{/key}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-caret-left"
		viewBox="0 0 16 16"
		on:click={previousHour}
	>
		<path
			d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"
		/>
	</svg>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-caret-right"
		viewBox="0 0 16 16"
		on:click={nextHour}
	>
		<path
			d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"
		/>
	</svg>
</div>

<style>
	#container {
		z-index: 1;
		position: relative;
		height: 150px;
		width: 350px;
		padding: 3%;
	}

	#title {
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
		color: rgb(255, 255, 255, 0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#separator {
		width: 330px;
		height: 3px;
		background-color: rgb(255, 255, 255, 0.5);
		margin-left: auto;
		margin-right: auto;
	}

	#hour-num {
		font-family: Arial, Helvetica, sans-serif;
		font-size: large;
		margin: 15px;
		color: rgb(255, 255, 255, 0.5);
		text-align: center;
		margin-right: 90%;
	}

	.bi {
		fill: rgb(255, 255, 255, 0.5);
		position: absolute;
	}

	.bi-caret-left {
		left: 0;
		top: 10%;
	}

	.bi-caret-right {
		left: 95%;
		top: 10%;
	}
</style>

<script>
	import ScheduleItem from './ScheduleItem.svelte';
	import Icon from '$lib/Icon.svelte';
	import { onMount } from 'svelte';
	import { generateICSContent, parseICSContent } from '$lib/functionics';
	import { currentView, userUid } from '../../store';
	import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fly, fade } from 'svelte/transition';

	// let ICSFiles;
	// let currentICSfiles;
	// let ICSContents;
	// let icsPath = 'gs://projet-l3-88394.appspot.com/icscalendar';
	// let goodIcsPath = 'icscalendar';
	// const defaultIcsPath = 'gs://projet-l3-88394.appspot.com/icscalendar/4PSFgCCPpzaOdKChhgyG.ics';
	let events = new Map();
	let eventsArray = [];
	let today = new Date();
	let currentDate = today;
	const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	const overlapValues = ['0%', '10%', '20%'];

	let flyParamsIn = {
		x: 100,
		delay: 150,
		opacity: 1
	};
	let flyParamsOut = {
		x: -100,
		delay: 150,
		opacity: 1
	};

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

	function compareHours(event1, event2) {
		return (
			(event1.start >= event2.start && event1.end <= event2.end) || // event1 contained within event2
			(event1.start <= event2.start && event1.end >= event2.end) || // event2 contained within event1
			(event1.end > event2.start && event1.end <= event2.end) || // event1's end contained within event2
			(event1.start < event2.end && event1.end >= event2.end) || // event2's end contained within event1
			(event1.start < event2.end && event1.start >= event2.start) || // event1's start contained within event2
			(event1.end > event2.start && event1.start <= event2.start)
		); // event2's start contained within event1
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

	function calculateOverlap(array) {
		for (let i = 0; i < array.length - 1; i++) {
			if (compareHours(array[i], array[i + 1])) {
				array[i + 1].overlap = array[i].overlap + 1;
			}
		}
	}

	/////////// DATA FETCHING AND TREATMENT //////////
	onMount(async () => {
		eventsArray = parseICSContent(generateICSContent());

		eventsArray.sort((eventA, eventB) => {
			let dateA = new Date(eventA.start);
			let dateB = new Date(eventB.start);
			return dateA - dateB;
		});

		let course;
		let courseData;
		try {
			course = doc(db, 'courses', 'courseInfos'); // temporary
			courseData = (await getDoc(course)).data();
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		eventsArray.forEach((event, index, arr) => {
			let endDate = new Date(event.end);
			let startDate = new Date(event.start);
			event.start = startDate;
			event.end = endDate;

			Object.assign(event, { height: (Math.abs(endDate - startDate) / 1000 / 3600) * 4 }); // difference between startDate and endDate in milliseconds, converted to a percentage of the height of the schedule

			let begin = new Date(
				startDate.getFullYear(),
				startDate.getMonth(),
				startDate.getDate(),
				8
			);
			Object.assign(event, {
				pos: (Math.abs(begin - startDate) / 1000 / 3600) * 4 + 1
			});
			// ESSAYER UNE GRID ESSAYER UNE GRID ESSAYER UNE GRID ESSAYER UNE GRID ESSAYER UNE GRID
			Object.assign(event, { overlap: 1 });

			Object.assign(event, { color: courseData[event.summary].color });
			Object.assign(event, { icon: courseData[event.summary].icon });
		});

		calculateOverlap(eventsArray);

		events = new Map(convertEventsArrayToMap(eventsArray));
	});

	///////////////////////////////////////////////////

	function nextDay(event) {
		currentDate.setDate(currentDate.getDate() + 1);
		stringDate = dateToString(currentDate);
		flyParamsIn.x = 300;
		flyParamsOut.x = -300;
	}

	function previousDay(event) {
		currentDate.setDate(currentDate.getDate() - 1);
		stringDate = dateToString(currentDate);
		flyParamsIn.x = -300;
		flyParamsOut.x = 300;
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
		<div id="schedule" in:fade out:fade>
			{#each { length: 11 } as _, i}
				<div id="separator"></div>
				<div id="hour-num">{i + 8}</div>
			{/each}

			<!-- nécessaire pour que le widget attende que la variable icon soit proprement chargée -->
			<div id="item-container">
				{#if events.get(stringDate)}
					<!-- TODO : ajouter icone et couleurs de tous les cours dans un seul document Firebase -->

					{#each events.get(stringDate) as event}
						<ScheduleItem
							name={event.summary}
							location={event.location}
							height={event.height}
							pos={event.pos}
							color={event.color}
							icon={event.icon}
							overlap={event.overlap}
							left={overlapValues[event.overlap - 1]}
						/>
					{/each}
				{/if}
			</div>
		</div>
	{/key}
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

	#item-container {
		position: absolute;
		z-index: 2;
		width: 90%;
		height: 100%;
		top: 0;
		left: 0;
		margin-left: 40px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(44, 1fr);
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

	/* #items {
		margin-left: 10%;
		margin-right: auto;
	} */

	p {
		color: rgb(0, 0, 0, 0.5);
		text-align: center;
		margin: 2%;
		font-size: large;
		margin-bottom: 5px;
	}
</style>

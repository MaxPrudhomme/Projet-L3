<script>
	// IDEA : put 5 (or 7) days of a week in horizontal scroll, with the buttons switching between weeks
	import ScheduleItem from './ScheduleItem.svelte';
	import Icon from '$lib/Icon.svelte';
	import { onMount } from 'svelte';
	import { querydb } from '$lib/function';
	import { currentView, userUid } from '../../store';
	import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { fade } from 'svelte/transition';

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

	const overlapValues = [['0%'], ['0%', '10%'], ['0%', '10%', '20%']];

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

	function compareHours(event1, event2) {
		// compares 2 dates and returns if there is an overlap between the two
		return (
			Math.min(event1.endDate, event2.endDate) -
				Math.max(event1.startDate, event2.startDate) >
			0
		);
	}

	function dateToString(date) {
		return (
			weekday[date.getDay()] +
			' - ' +
			date.getDate() +
			'/' +
			(date.getMonth() + 1) +
			'/' +
			date.getFullYear()
		);
	}
	let stringDates = [];
	currentWeek.forEach((day) => {
		stringDates.push(dateToString(day));
	});

	function convertEventsArrayToMap(eventsArray) {
		// converts an array of events into a map of array with key/value for each day
		let eventsMap = new Map();

		eventsArray.forEach((event) => {
			let eventDate = dateToString(event.startDate);
			if (!eventsMap.has(eventDate)) eventsMap.set(eventDate, []);

			eventsMap.get(eventDate).push(event);
		});

		return eventsMap;
	}

	function calculateOverlap(array) {
		for (let i = 0; i < array.length - 1; i++) {
			if (compareHours(array[i], array[i + 1])) {
				// array[i].overlap += 1;
				array[i + 1].overlap = array[i].overlap + 1;
			}
		}
	}

	function getMonday(d) {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
		let r = new Date(d.setDate(diff));
		r.setHours(0, 0, 0, 0);
		return r;
	}

	function getSunday(d) {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + 7; // adjust when day is sunday
		let r = new Date(d.setDate(diff));
		r.setHours(0, 0, 0, 0);
		return r;
	}

	async function getEvents(day) {
		if ($currentView == 'dashboard') {
			// if widget is on dashboard, load all the schedule items, else only load the items of the viewed course
			const userCoursesIds = (
				await getDocs(collection(db, 'users', $userUid, 'userCourses'))
			).docs.map(({ id }) => id);

			eventsArray = await querydb(getMonday(day), getSunday(day), userCoursesIds); // preloads the data for the entire week
		} else {
			eventsArray = await querydb(getMonday(day), getSunday(day), $currentView);
		}
		console.log(eventsArray);

		let course;
		let courseData;
		try {
			// fetching data specific to the courses from Firebase
			course = doc(db, 'courses', 'courseInfos');
			courseData = (await getDoc(course)).data();
		} catch (error) {
			console.error('Error fetching documents:', error);
		}

		eventsArray.forEach((event, index, arr) => {
			let endDate = new Date(event.endDate);
			let startDate = new Date(event.startDate);
			event.startDate = startDate;
			event.endDate = endDate;

			Object.assign(event, { height: (Math.abs(endDate - startDate) / 1000 / 3600) * 4 }); // difference between startDate and endDate in milliseconds, converted to a percentage of the height of the schedule

			let begin = new Date(
				startDate.getFullYear(),
				startDate.getMonth(),
				startDate.getDate(),
				8
			);
			Object.assign(event, {
				pos: (Math.abs(begin - startDate) / 1000 / 3600) * 4 + 2
			});
			Object.assign(event, { overlap: 1 });

			Object.assign(event, { color: courseData[event.IDcourse].color });
			Object.assign(event, { icon: courseData[event.IDcourse].icon });
		});

		eventsArray.sort((eventA, eventB) => {
			return eventA.startDate - eventB.startDate;
		});

		calculateOverlap(eventsArray);

		events = new Map(convertEventsArrayToMap(eventsArray));
	}

	/////////// DATA FETCHING AND TREATMENT //////////
	onMount(async () => {
		await getEvents(today);
	});
	///////////////////////////////////////////////////

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
		getEvents(currentWeek[1]);
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
		getEvents(currentWeek[1]);
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

				<div id="item-container">
					{#key stringDates}
						{#if events.get(stringDates[i + 1])}
							{#each events.get(stringDates[i + 1]) as event, i}
								<!-- un semaine en JS commence le dimanche, d'où le +1 -->
								<ScheduleItem
									name={event.summary}
									location={event.location}
									height={event.height}
									pos={event.pos}
									color={event.color}
									icon={event.icon}
									overlap={event.overlap}
								/>
							{/each}
						{/if}
					{/key}
				</div>
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
		width: 50%;
	}

	#item-container {
		position: absolute;
		z-index: 2;
		width: 90%;
		top: 0;
		left: 0;
		height: 100%;
		padding-left: 40px;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(44, 1fr);
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
		left: 45%;
	}

	#separator {
		width: 100%;
		height: 3px;
		background-color: rgb(255, 255, 255, 0.5);
		margin-left: 5px;
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
		width: 93%;
		height: 16px;
		margin-left: 3%;
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

<script>
	import ScheduleItem from './ScheduleItem.svelte';
	import Icon from '$lib/Icon.svelte';
	import { onMount } from 'svelte';
	import { querydb } from '$lib/function';
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
	let events;
	let eventsArray = [];
	let todayEvents;
	let today = new Date();
	let currentDate = today;
	const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

	function getSingleDayFromEventsArray(eventsArray) {
		// converts an array of events into a map of array with key/value for each day
		let dayEvents = [];

		eventsArray.forEach((event) => {
			if (dateToString(event.start) == stringDate) dayEvents.push(event);
		});

		return dayEvents;
	}

	function getMonday(d) {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
		return new Date(d.setDate(diff));
	}

	function getSunday(d) {
		d = new Date(d);
		var day = d.getDay(),
			diff = d.getDate() - day + 7; // adjust when day is sunday
		return new Date(d.setDate(diff));
	}

	onMount(async () => {
		if ($currentView == 'dashboard') {
		const userCoursesIds = (
			await getDocs(collection(db, 'users', $userUid, 'userCourses'))
		).docs.map(({ id }) => id);
		eventsArray = await querydb(getMonday(today), getSunday(today), userCoursesIds);
	} else {
		eventsArray = await querydb(getMonday(today), getSunday(today), $currentView);
	}
	console.log(eventsArray);
	})


	let course;
	let courseData;
	eventsArray.forEach(async (event) => {
		let endDate = new Date(event.end);
		let startDate = new Date(event.start);
		event.start = startDate;
		event.end = endDate;

		Object.assign(event, { height: Math.abs(endDate - startDate) / 1000 / 360 / 2 }); // difference between startDate and endDate in milliseconds, converted to a percentage of the height of the schedule

		let begin = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8);
		Object.assign(event, { pos: Math.abs(begin - startDate) / 1000 / 360 - 6.5 }); // -7% pour compenser la hauteur du titre

		try {
			course = doc(db, 'courses', '4PSFgCCPpzaOdKChhgyG'); // temporary
			courseData = (await getDoc(course)).data();
			Object.assign(event, { color: courseData.color });
			Object.assign(event, { icon: courseData.icon });
		} catch (error) {
			console.error('Error fetching documents:', error);
		}
	});

	events = getSingleDayFromEventsArray(eventsArray);

	function nextItem(event) {
		if (i < events.length - 1) i++;
		flyParamsIn.x = 300;
		flyParamsOut.x = -300;
	}

	function previousItem(event) {
		if (i > 0) i--;
		flyParamsIn.x = -300;
		flyParamsOut.x = 300;
	}

	let i = 0;
</script>

<div id="container">
	<h1 id="title">Schedule</h1>
	<p>{stringDate}</p>
	{#if events && courseData}
		{#key i}
			<div id="schedule" in:fly={flyParamsIn} out:fly={flyParamsOut}>
				<ScheduleItem
					name={events[i].summary}
					location={events[i].location}
					color={events[i].color}
					icon={events[i].icon}
				></ScheduleItem>
			</div>
		{/key}
	{/if}

	<div id="arrows">
		<button class="buttonReset bi-caret-left" on:click={previousItem}>
			<Icon name="arrow-left" width="16" height="16" />
		</button>
		<button class="buttonReset bi-caret-right" on:click={nextItem}>
			<Icon name="arrow-right" width="16" height="16" />
		</button>
	</div>
</div>

<style>
	#container {
		z-index: 1;
		position: relative;
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#title {
		text-align: center;
		font-family: Arial, Helvetica, sans-serif;
		color: rgb(255, 255, 255, 0.5);
		font-size: large;
		margin-top: 10px;
	}

	#arrows {
		position: absolute;
		top: 10px;
		width: 90%;
		margin-left: 5%;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		fill: rgb(255, 255, 255, 0.5);
	}

	#schedule {
		width: 90%;
		height: 70%;
	}

	p {
		color: rgb(0, 0, 0, 0.5);
		text-align: center;
		margin: 2%;
		font-size: large;
		margin-bottom: 5px;
	}
</style>

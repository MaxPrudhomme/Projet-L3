<script>
	import ScheduleItem from './ScheduleItem.svelte';
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
	let events = [];
	let color;
	let icon;

	onMount(() => {
		events = parseICSContent(generateICSContent());

		console.log(events);

		events.forEach(async (event) => {
			let endDate = new Date(event.end);
			let startDate = new Date(event.start);
			event.start = startDate;
			event.end = endDate;

			Object.assign(event, { height: Math.abs(endDate - startDate) / 1000 / 360 / 2 }); // difference between startDate and endDate in milliseconds, converted to a percentage of the height of the schedule

			let begin = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 8);
			Object.assign(event, { pos: Math.abs(begin - startDate) / 1000 / 360 });

			try {
				let course = doc(db, 'courses', '4PSFgCCPpzaOdKChhgyG'); // temporary
				let courseData = (await getDoc(courseRef)).data();
				color = courseData.color;
				icon = courseData.icon;
			} catch (error) {
				console.error('Error fetching documents:', error);
			}

			// TODO : find way to get the icon from the specific course (and a possible color)
		});
	});

	console.log(events);
</script>

<div id="container">
	<h1 id="title">Schedule</h1>
	<div id="schedule">
		{#each { length: 11 } as _, i}
			<div id="separator"></div>
			<div id="hour-num">{i + 8}</div>
		{/each}

		{#key events}
			{#each events as event}
				<ScheduleItem
					name={event.summary}
					location={event.location}
					height={event.height + '%'}
					pos={event.pos + '%'}
					{color}
					{icon}
				/>
			{/each}
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
		margin-bottom: 20px;
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
</style>

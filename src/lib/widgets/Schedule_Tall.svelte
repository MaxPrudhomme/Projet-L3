<script>
	import ScheduleItem from './ScheduleItem.svelte';
	import { onMount } from 'svelte';
	import { fetchICSFiles, parseICSFile, addICSFile } from '$lib/functionics';
	import { currentView } from '../../store';

	let ICSFiles;
	let currentICSfiles;
	let ICSContents;

	onMount(async () => {
		ICSFiles = await fetchICSFiles();
		if ($currentView != 'dashboard') {
			// if the view is on a specific course, only keep the ICS file for this course
			currentICSfiles = ICSFiles.find((file) => {
				file.name == $currentView + '.ics';
			});
		} else currentICSfiles = ICSFiles; // else we keep all the files

		ICSContents = new Array();
		currentICSfiles.forEach(async (file) => {
			let parsed = await parseICSFile(file.url);
			let date = new Date(parsed.date);
			parsed.date = date;
			ICSContents.push(parsed);
		});

		console.log(ICSContents);
	});
</script>

<div id="container">
	<h1 id="title">Schedule</h1>
	<div id="schedule">
		{#each { length: 12 } as _, i}
			<div id="separator"></div>
			<div id="hour-num">{i + 8}</div>
		{/each}
		<ScheduleItem
			name="Placeholder"
			place="A113"
			color="red"
			height="50px"
			pos="50px"
			icon="%sveltekit.assets%/favicon.png"
		></ScheduleItem>
		<!-- paramètres à remplir avec les données du backend -->
		<ScheduleItem
			name="Placeholder2"
			place="A113"
			color="blue"
			height="50px"
			pos="150px"
			icon="%sveltekit.assets%/favicon.png"
		></ScheduleItem>
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
		margin-top: 15px;
		margin-bottom: 15px;
		margin-left: 2%;
		color: rgb(255, 255, 255, 0.5);
		text-align: center;
		margin-right: 90%;
	}

	#schedule {
		width: 350px;
		margin-left: auto;
		margin-right: auto;
	}
</style>

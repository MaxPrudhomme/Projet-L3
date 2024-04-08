<script>
	import ScheduleItem from './ScheduleItem.svelte';

	export let hours;
	export let subjects;
	export let places;
	export let colors;

	let i = 0;
	function nextHour(event) {
		if (i < 12) i++;
	}
	function previousHour(event) {
		if (i > 0) i--;
	}
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
						name={subjects[j]}
						place={places[j]}
						color={colors[j]}
						height="50px"
						icon="%sveltekit.assets%/favicon.png"
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

<script>
	import { onMount } from 'svelte';
	import AverageSmall from '$lib/widgets/Average_Small.svelte';
	import HomeworkTall from '$lib/widgets/Homework_Tall.svelte';
	import LastMarksSmall from '$lib/widgets/LastMarks_Small.svelte';

	export let content;
	export let disabled = false;

	let containerRef;
	let blockerRef;
	let CurrentWidget;

	const widgetMap = {
		'average-s': AverageSmall,
		'homework-t': HomeworkTall,
		'lastmarks-s': LastMarksSmall
	};

	onMount(() => {
		let target = content[0] + '-' + content[1];
		CurrentWidget = widgetMap[target];
	});
</script>

<div id="container" bind:this={containerRef}>
	{#if disabled}
		<div id="blocker" bind:this={blockerRef} style="visibility: visible;"></div>
	{:else}
		<div id="blocker" bind:this={blockerRef} style="visibility: hidden;"></div>
	{/if}

	{#if CurrentWidget}
		<CurrentWidget />
	{/if}
</div>

<style>
	#container {
		display: inline-flex;
		position: relative;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
		scrollbar-width: none;
		overflow: hidden;
	}

	#blocker {
		border-radius: 20px;
		cursor: pointer;
	}
</style>

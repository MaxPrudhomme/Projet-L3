<script>
	import { onMount } from 'svelte';
	import AverageSmall from '$lib/widgets/Average_Small.svelte';
	import HomeworkTall from '$lib/widgets/Homework_Tall.svelte';
	import MarkLarge from '$lib/widgets/Mark_Large.svelte';
	import MarkTall from '$lib/widgets/Mark_Tall.svelte';

	import ExamSmall from '$lib/widgets/Exam_Small.svelte';
  
	export let content;
	export let disabled = false;

	let containerRef;
	let blockerRef;
	let CurrentWidget;

	const widgetMap = {
		'average-s': AverageSmall,
		'homework-t': HomeworkTall,
		'lastmark-l': MarkLarge,
		'marks-t': MarkTall
	  'exam-s': ExamSmall
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

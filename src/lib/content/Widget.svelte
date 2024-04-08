<script>
	import { onMount } from 'svelte';

	import Averages_Large from '$lib/widgets/Averages_Large.svelte';
	import Marks_Large from '$lib/widgets/Marks_Large.svelte';
	import Vacations_Medium from '$lib/widgets/Vacations_Medium.svelte';
	import LastMarks_Small from '$lib/widgets/LastMarks_Small.svelte';
	import Vacations_Small from '$lib/widgets/Vacations_Small.svelte';
	import Homework_Medium from '$lib/widgets/Homework_Medium.svelte';

	export let height = null;
	export let width = null;
	export let disabled = false;

	let containerRef;
	let blockerRef;

	onMount(() => {
		if (height !== null && width !== null) {
			containerRef.style.height = height + 'px';
			containerRef.style.width = width + 'px';
			blockerRef.style.height = height + 'px';
			blockerRef.style.width = width + 'px';
		}
	});
</script>

<div id="container" bind:this={containerRef}>
	{#if disabled}
		<div id="blocker" bind:this={blockerRef} style="visibility: visible;"></div>
	{:else}
		<div id="blocker" bind:this={blockerRef} style="visibility: hidden;"></div>
	{/if}

	<Homework_Medium></Homework_Medium>
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
		overflow-y: auto;
	}

	#blocker {
		border-radius: 20px;
		cursor: pointer;
	}

	/* width */
	::-webkit-scrollbar {
		width: 20px;
	}

	/* Track */
	::-webkit-scrollbar-track {
		box-shadow: inset 0 0 5px grey;
		border-radius: 10px;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
		background: red;
		border-radius: 10px;
	}
</style>

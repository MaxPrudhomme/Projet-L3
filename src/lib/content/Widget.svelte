<script>
	import { onMount } from 'svelte';

	import Averages_Large from '$lib/widgets/Averages_Large.svelte';
	import Marks_Large from '$lib/widgets/Marks_Large.svelte';
	import Vacations_Medium from '$lib/widgets/Vacations_Medium.svelte';
	import LastMarks_Small from '$lib/widgets/LastMarks_Small.svelte';

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

	<LastMarks_Small
		marks={[11, 15, 2]}
		dates={['11/03/2024', '25/03/2024', '01/04/2024']}
		names={['Algo', 'SQL', 'Maths']}
	></LastMarks_Small>
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

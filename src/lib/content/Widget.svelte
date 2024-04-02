<script>
	import { onMount } from 'svelte';

	import Averages_Large from '$lib/widgets/Averages_Large.svelte';

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

	<Averages_Large
		courses={['Algorithmics', 'Cringe', 'Based', 'Saucisse', 'Rougail']}
		averages={[15, 20, 9, 17, 2]}
	></Averages_Large>
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

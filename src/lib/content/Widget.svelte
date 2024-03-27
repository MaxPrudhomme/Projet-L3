<script>
	import Schedule_Large from '$lib/widgets/Schedule_Large.svelte';
	import LastMarks_Medium from '$lib/widgets/LastMarks_Medium.svelte';
	import Vacations_Medium from '$lib/widgets/Vacations_Medium.svelte';
	let containerRef;
</script>

<div id="container" bind:this={containerRef}>
	<Vacations_Medium vacationsDate="24/05/2024"></Vacations_Medium>
</div>

<style>
	#container {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
	}
</style>

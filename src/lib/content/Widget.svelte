<script>
	import Schedule_Large from '$lib/widgets/Schedule_Large.svelte';
	import LastMarks_Small from '$lib/widgets/LastMarks_Small.svelte';
	import Vacations_Medium from '$lib/widgets/Vacations_Medium.svelte';
	import Average_Small from '$lib/widgets/Average_Small.svelte';
	import NextExam_Small from '$lib/widgets/NextExam_Small.svelte';
	import Homework_Large from '$lib/widgets/Homework_Large.svelte';
	let containerRef;
</script>

<div id="container" bind:this={containerRef}>
	<Homework_Large></Homework_Large>
</div>

<style>
	#container {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
		padding: 5px;
	}
</style>

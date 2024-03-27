<script>
	import Schedule_Large from '$lib/widgets/Schedule_Large.svelte';
	import LastMarks_Medium from '$lib/widgets/LastMarks_Medium.svelte';
	import Vacations_Medium from '$lib/widgets/Vacations_Medium.svelte';
	import Average_Small from '$lib/widgets/Average_Small.svelte';
	let containerRef;
</script>

<div id="container" bind:this={containerRef}>
	<Average_Small mark="15"></Average_Small>
</div>

<style>
	#container {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
	}
</style>

<script>
	import Schedule_Large from '$lib/widgets/Schedule_Large.svelte';
	import LastMarks_Medium from '$lib/widgets/LastMarks_Medium.svelte';
	let containerRef;
</script>

<div id="container" bind:this={containerRef}>
	<LastMarks_Medium name="Algorithms" mark="15" date="21/09/2022"></LastMarks_Medium>
</div>

<style>
	#container {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
	}
</style>

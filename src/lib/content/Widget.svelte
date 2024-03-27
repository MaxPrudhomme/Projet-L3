<script>
	import Schedule_Large from '$lib/widgets/Schedule_Large.svelte';
	let containerRef;
</script>

<div id="container" bind:this={containerRef}><Schedule_Large></Schedule_Large></div>

<style>
	#container {
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
	}
</style>

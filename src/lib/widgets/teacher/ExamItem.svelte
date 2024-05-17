<script>
	import Icon from '$lib/Icon.svelte';
	import { currentView } from '../../../store';
	import { doc } from 'firebase/firestore';

	export let date;
	export let details;
	export let name;

	let up = false;
	let itemRef;
</script>

<div id="container" bind:this={itemRef}>
	<!-- AJOUTER AFFICHAGE HEURE -->
	<div id="align">
		<h1>{name}</h1>
		<h2>{date}</h2>
	</div>

	<p>{details}</p>
</div>

<style>
	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		font-family: 'SF Pro Display';
		width: 80%;
		height: 15%;
		padding: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
		overflow: auto;

		font-family: Arial, Helvetica, sans-serif;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	#container::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}

	#align {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	h1 {
		margin-top: -5px;
		margin-bottom: 5px;
		font-size: x-large;
	}

	h2 {
		font-size: large;
		margin-left: 10%;
	}

	p {
		text-wrap: wrap;
	}
</style>

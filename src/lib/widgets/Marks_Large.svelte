<script>
	import MarkItem from './MarkItem.svelte';

	let currentSemester = 1; // true if first semester, false if second semester

	export let first;
	export let second;
</script>

<div id="container">
	<h1 id="title">Marks</h1>

	<div id="display">
		{#key currentSemester}
			{#if currentSemester == 1}
				{#each first as f}
					<MarkItem mark={f} prof="M. Puel" date="21/09/2022" notes="hmm yes very good"></MarkItem>
				{/each}
			{/if}
			{#if currentSemester == 2}
				{#each second as s}
					<MarkItem mark={s} prof="M. Puel" date="21/09/2022" notes="hmm yes very good"></MarkItem>
				{/each}
			{/if}
		{/key}
	</div>

	<div id="periods">
		<button
			on:click={() => {
				currentSemester = 1;
				console.log(currentSemester);
			}}>P1</button
		>
		<button
			on:click={() => {
				currentSemester = 2;
				console.log(currentSemester);
			}}>P2</button
		>
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
		overflow-x: hidden;
		width: 360px;
	}

	#display {
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		overflow-x: hidden;
		align-items: center;
		height: 650px;
	}

	#title {
		text-align: center;
		align-self: center;
		font-family: 'SF Pro Display';
		font-weight: normal;
		color: rgb(0, 0, 0, 0.5);
		font-size: 20px;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#periods {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-top: 1px solid rgb(0, 0, 0, 0.5);
		vertical-align: bottom;
		padding-top: 5px;
		padding-left: 20%;
		padding-right: 20%;
		margin-left: 5%;
		margin-right: 5%;
	}

	button {
		background: none;
		font-family: 'SF Pro Display';
		font-weight: normal;
		font-size: large;
		color: rgb(0, 0, 0, 0.5);
		background: none;
		border: 1px solid rgba(0, 0, 0, 0);
		padding: 5px;
		outline: inherit;
		/* margin-left: 15%;
		margin-right: 15%; */
		margin-bottom: 10px;
	}

	button:hover {
		border: 1px solid rgb(0, 0, 0, 0.5);
		border-radius: 5px;
	}
</style>

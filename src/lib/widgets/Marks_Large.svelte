<script>
	import MarkItem from './MarkItem.svelte';

	let currentSemester = 1; // true if first semester, false if second semester

	export let marks;
	export let semesters;

	function changePeriod(semester) {
		currentSemester = semester;
	}
</script>

<div id="container">
	<h1 id="title">Marks</h1>

	<!-- {#each marks.length as _, i}
		{#if semesters[i] == currenstSemester}
			<MarkItem mark={marks[i]}></MarkItem>
		{/if}
	{/each} ça fout la merde, à fix-->

	<div id="periods">
		<button onclick={changePeriod(1)}>P1</button>
		<button onclick={changePeriod(2)}>P2</button>
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
		border: none;
		padding: 5px;
		outline: inherit;
		/* margin-left: 15%;
		margin-right: 15%; */
		margin-bottom: 10px;
	}

	button:hover {
		border: 1px solid rgb(255, 255, 255, 0.5);
		border-radius: 5px;
	}
</style>

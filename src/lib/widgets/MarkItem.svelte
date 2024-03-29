<script>
	export let mark;

	let arrowDownPath =
		'M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z';
	let arrowUpPath =
		'M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z';
</script>

<div id="container">
	<h1 id="mark">{mark}</h1>
	<h2>/20</h2>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="50"
		height="50"
		fill="currentColor"
		class="bi bi-arrow-up-square"
		viewBox="0 0 16 16"
	>
		<path fill-rule="evenodd" d={arrowDownPath} />
	</svg>
</div>

<style>
	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		font-family: 'SF Pro Display';
		width: 80%;
		padding: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: row;
	}

	#mark {
		font-weight: bold;
		font-size: 50px;
	}

	h2 {
		font-size: x-large;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 10%;
		margin-left: 5%;
	}

	svg {
		margin-top: auto;
		margin-bottom: auto;
		margin-left: auto;
		margin-right: 5%;
	}
</style>

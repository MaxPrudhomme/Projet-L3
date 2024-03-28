<script>
	export let date; // date due in string format
	export let tasks; // list of tasks in an array of strings
	export let givenDate; // date the homework was given in string format

	date = date.split('/');
	let actualDate = new Date(date[2], date[1], date[0]);
	let today = new Date();

	let diffTime = Math.abs(actualDate - today);
	let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
</script>

<div id="container">
	{#if diffDays < 1}
		<h1 id="today">Today</h1>
	{/if}
	{#if diffDays >= 1}
		<h1 id="due-date">{date.join(' / ')}</h1>
	{/if}
	<ul>
		{#each tasks as task}
			<li>{task}</li>
		{/each}
	</ul>
	<p>given {givenDate}</p>
</div>

<style>
	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		font-family: 'SF Pro Display';
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 80%;
		margin-left: auto;
		margin-right: auto;
		padding: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	#due-date {
		font-size: larger;
	}

	#today {
		font-size: larger;
		color: lawngreen;
	}

	ul {
		list-style: circle;
		margin-left: 10%;
		margin-top: 10px;
		margin-bottom: 10px;
	}

	p {
		text-align: right;
		color: rgb(0, 0, 0, 0.5);
	}
</style>

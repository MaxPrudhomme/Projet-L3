<script>
	export let vacationsDate; // as a string in the form of "01/01/2024"

	vacationsDate = vacationsDate.split('/');
	let actualVacationsDate = new Date(vacationsDate[2], vacationsDate[1], vacationsDate[0]);
	let today = new Date();

	let diffTime = Math.abs(actualVacationsDate - today);
	let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
</script>

<div id="container">
	<h1 id="title">Vacations</h1>
	<div id="circle">
		<p>Vacations in</p>
		{#if diffDays > 1}
			<h1 id="time">{diffDays} days</h1>
		{/if}
		{#if diffDays == 1}
			<h1 id="time">{diffDays} day</h1>
		{/if}
	</div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 170px;
		width: 150px;
		align-items: center;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
	}

	#title {
		text-align: center;
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	#circle {
		border: 7px solid;
		border-color: #00ffff;
		border-radius: 50%;
		text-align: center;
		height: 120px;
		width: 120px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-bottom: 5%;
	}

	#time {
		font-size: 25px;
	}

	p {
		font-size: large;
	}
</style>

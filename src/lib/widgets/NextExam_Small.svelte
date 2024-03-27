<script>
	export let examDate; // as a string in the form of "01/01/2024"

	examDate = examDate.split('/');
	let actualExamDate = new Date(examDate[2], examDate[1], examDate[0]);
	let today = new Date();

	let diffTime = Math.abs(actualExamDate - today);
	let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
</script>

<div id="container">
	<h1 id="title">Next Exam</h1>
	{#if diffDays > 1}
		<h1 id="time">{diffDays} days</h1>
	{/if}
	{#if diffDays == 1}
		<h1 id="time">{diffDays} day</h1>
	{/if}
	<p>{examDate.join('/')}</p>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 150px;
		align-items: center;
		font-family: 'SF Pro Display';
	}

	#title {
		text-align: center;
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#time {
		font-size: 40px;
		font-weight: bold;
		margin-bottom: 10%;
	}

	p {
		font-size: large;
		color: rgb(0, 0, 0, 0.5);
		margin-bottom: -10%;
	}
</style>

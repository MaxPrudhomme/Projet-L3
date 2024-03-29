<script>
	import AveragesItem from './AveragesItem.svelte';
	export let courses; // array of courses with an average
	export let averages; // tha average for each course

	// we'll just input the raw average value for now, but ideally the input should be the individual marks and their coefficients
</script>

<div id="container">
	<h1 id="title">Averages</h1>

	<div id="display">
		<AveragesItem course={courses[0]} average={averages[0]}></AveragesItem>
		<AveragesItem course={courses[1]} average={averages[1]}></AveragesItem>
		<AveragesItem course={courses[2]} average={averages[2]}></AveragesItem>
	</div>

	<div id="values">
		<p>0</p>
		<p>5</p>
		<p>10</p>
		<p>15</p>
		<p>20</p>
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
		font-family: 'SF Pro Display';
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#values {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-top: 1px solid rgb(0, 0, 0, 0.5);
		vertical-align: bottom;
		padding-top: 5px;
		padding-left: 10%;
		padding-right: 10%;
	}

	#values p {
		font-family: 'SF Pro Display';
		font-weight: normal;
		font-size: large;
		color: rgb(0, 0, 0, 0.5);
		padding: 5px;
		outline: inherit;
		margin-bottom: 10px;
	}
</style>

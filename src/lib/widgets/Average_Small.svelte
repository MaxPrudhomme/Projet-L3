<script>
	export let mark;
</script>

<div class="container">
	<h1 id="title">Average</h1>
	<h1 id="mark">{mark}</h1>
	<p id="out-of">/20</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 150px;
		font-family: 'SF Pro Display';
	}

	#title {
		text-align: center;
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 10px;
	}

	#mark {
		text-align: center;
		margin-top: auto;
		font-size: 80px;
		justify-self: center;
		font-weight: bold;
	}

	#out-of {
		text-align: right;
		font-size: x-large;
		margin-right: 10%;
		margin-bottom: auto;
		margin-top: -10px;
		color: rgb(0, 0, 0, 0.5);
	}
</style>

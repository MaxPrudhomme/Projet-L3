<script>
	export let marks;
	export let dates;
	export let names;
</script>

<div class="container">
	<h1 id="title">Last marks</h1>
	<div id="content">
		<div class="upper left mark">
			<h1 id="name">{names[0]}</h1>
			<h1 id="mark">{marks[0]}</h1>
			<p id="out-of">/20</p>
			<p id="date">{dates[0]}</p>
		</div>
		<div class="upper right mark">
			<h1 id="name">{names[1]}</h1>
			<h1 id="mark">{marks[1]}</h1>
			<p id="out-of">/20</p>
			<p id="date">{dates[1]}</p>
		</div>
		<div class="lower left mark">
			<h1 id="name">{names[2]}</h1>
			<h1 id="mark">{marks[2]}</h1>
			<p id="out-of">/20</p>
			<p id="date">{dates[2]}</p>
		</div>
		<div class="lower right mark">
			<h1 id="name">{names[3]}</h1>
			<h1 id="mark">{marks[3]}</h1>
			<p id="out-of">/20</p>
			<p id="date">{dates[3]}</p>
		</div>
	</div>
</div>

<style>
	#content {
		display: grid;
		align-self: center;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 10%;
		width: 350px;
	}

	.mark {
		border: 1px solid black;
		border-radius: 20px;
		margin: 0.5rem;
	}

	.left {
		grid-column: 1;
	}

	.right {
		grid-column: 2;
	}

	.upper {
		grid-row: 1;
	}

	.lower {
		grid-row: 2;
	}

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 150px;
		width: 100%;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 5px;
	}

	#title {
		text-align: center;
		color: rgb(0, 0, 0, 0.5);
		font-size: large;
		margin-top: 10px;
	}

	#name {
		text-align: center;
		font-weight: lighter;
		font-size: 25px;
		margin-top: 5%;
	}

	#mark {
		text-align: center;
		margin-top: auto;
		font-size: 50px;
		justify-self: center;
		margin-left: auto;
		margin-right: auto;
	}

	#out-of {
		text-align: right;
		font-size: x-large;
		margin-right: 10%;
		margin-bottom: auto;
		margin-top: -10%;
		color: rgb(0, 0, 0, 0.5);
	}

	#date {
		text-align: center;
		vertical-align: bottom;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 7%;
	}
</style>

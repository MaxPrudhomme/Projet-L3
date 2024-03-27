<script>
	export let mark;
	export let date;
	export let name;
</script>

<div class="container">
	<h1 id="title">Last marks</h1>
	<h1 id="name">{name}</h1>
	<h1 id="mark">{mark}</h1>
	<p id="out-of">/20</p>
	<p id="date">{date}</p>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 350px;
		font-family: 'SF Pro Display';
	}

	#title {
		text-align: center;
		color: rgb(0,0,0,0.5);
		font-size: large;
		margin-top: 10px;
		margin-bottom: 20px;
	}

	#name {
		text-align: center;
		font-weight: lighter;
	}

	#mark {
		text-align: center;
		margin-top: auto;
		font-size: 100px;
		justify-self: center;
	}

	#out-of {
		text-align: right;
		font-size: x-large;
		margin-right: 10%;
		margin-bottom: auto;
		color: rgb(0,0,0,0.5);
	}

	#date {
		text-align: center;
		vertical-align: bottom;
		color: rgb(0,0,0,0.5);
	}
</style>

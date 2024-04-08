<script>
	import { fly } from 'svelte/transition';
	export let marks;
	export let dates;
	export let names;

	let i = 0;
	let flyParamsIn = {
		x: 100,
		delay: 200,
		opacity: 0.5
	};
	let flyParamsOut = {
		x: -100,
		delay: 200,
		opacity: 0.5
	};

	function nextMark(event) {
		if (i < marks.length - 1 && i < 5) i++;
		flyParamsIn.x = -100;
		flyParamsOut.x = 100;
	}
	function previousMark(event) {
		if (i > 0) i--;
		flyParamsIn.x = 100;
		flyParamsOut.x = -100;
	}
</script>

<div class="container">
	{#key i}
		<div id="content" in:fly={flyParamsIn} out:fly={flyParamsOut}>
			<h1 id="title">Last marks</h1>
			<h1 id="name">{names[i]}</h1>
			<h1 id="mark">{marks[i]}</h1>
			<p id="out-of">/20</p>
			<p id="date">{dates[i]}</p>
		</div>
	{/key}

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-caret-left"
		viewBox="0 0 16 16"
		on:click={previousMark}
	>
		<path
			d="M10 12.796V3.204L4.519 8zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753"
		/>
	</svg>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="16"
		height="16"
		fill="currentColor"
		class="bi bi-caret-right"
		viewBox="0 0 16 16"
		on:click={nextMark}
	>
		<path
			d="M6 12.796V3.204L11.481 8zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753"
		/>
	</svg>
</div>

<style>
	.bi-caret-left {
		position: absolute;
		left: 0;
		top: 50%;
	}

	.bi-caret-right {
		position: absolute;
		left: 90%;
		top: 50%;
	}

	.bi:hover {
		fill: black;
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

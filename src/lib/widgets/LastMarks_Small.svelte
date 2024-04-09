<script>
	import { fly } from 'svelte/transition';
	import { currentContent } from '../../store';
	import Icon from '$lib/Icon.svelte';

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
		if (i < $currentContent['marks'].length - 1 && i < 5) i++;
		flyParamsIn.x = 100;
		flyParamsOut.x = -100;
	}
	function previousMark(event) {
		if (i > 0) i--;
		flyParamsIn.x = -100;
		flyParamsOut.x = 100;
	}
</script>

<div class="container">
	{#key i}
		<div id="content" in:fly={flyParamsIn} out:fly={flyParamsOut}>
			<h1 class="widgetTitle">Last marks</h1>
			<h1 id="name">{$currentContent['marks'][i].name}</h1>
			<h1 id="mark">{$currentContent['marks'][i].mark}</h1>
			<p id="out-of">/20</p>
			<p id="date">{$currentContent['marks'][i].date}</p>
		</div>
	{/key}

	<button class="buttonReset bi-caret-left" on:click={previousMark}>
		<Icon name="arrow-left" width="16" height="16" />
	</button>
	<button class="buttonReset bi-caret-right" on:click={nextMark}>
		<Icon name="arrow-right" width="16" height="16" />
	</button>
</div>

<style>
	@import '../../global.css';

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

	.container {
		position: relative;
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		font-family: 'SF Pro Display';
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 5px;
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
		margin-bottom: 5px;
	}
</style>

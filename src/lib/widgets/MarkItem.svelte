<script>
	import Icon from '$lib/Icon.svelte';

	export let mark;
	export let maxMark;
	export let date;
	export let details;
	export let name;

	let up = false;
	let btn;
</script>

<div id="container">
	<div id="main">
		<h1 id="mark">{mark}</h1>
		<h2>/ {maxMark}</h2>
		<button
			class="buttonReset"
			bind:this={btn}
			on:click={() => {
				if (up) {
					btn.style.transform = 'rotate(0deg)';
					btn.style.transition = 'transform 0.5s ease-in-out';
					up = false;
				} else {
					btn.style.transform = 'rotate(180deg)';
					btn.style.transition = 'transform 0.5s ease-in-out';
					up = true;
				}
			}}><Icon name="arrow-box" width="50" height="50" /></button
		>
	</div>

	<div id="details" class="card {!up ? 'hidden' : 'visible'}">
		<p>{name}</p>
		<p id="date">{date}</p>
		<div id="separator"></div>
		<p id="notes">Details</p>
		<p id="content">{details}</p>
	</div>
</div>

<style>
	@import '../../global.css';
	.hidden {
		display: none;
		visibility: hidden;
		transition: margin-bottom 2s;
	}

	.visible {
		display: block;
		visibility: visible;
		transition: margin-bottom 2s;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.visible::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}

	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		font-family: 'SF Pro Display';
		width: 80%;
		padding: 10px;
		margin-top: 10px;
		margin-bottom: 10px;
		display: flex;
		flex-direction: column;
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	#main {
		display: flex;
		flex-direction: row;
	}

	#mark {
		font-weight: bolder;
		font-size: 50px;
	}

	h2 {
		font-size: x-large;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 10%;
		margin-left: 2%;
	}

	button {
		margin-top: auto;
		margin-bottom: auto;
		margin-left: auto;
		margin-right: 5%;
	}

	p {
		color: black;
		font-size: medium;
		margin-left: 5%;
		margin-top: 5px;
		margin-bottom: 10px;
	}

	#date {
		font-size: larger;
		margin-top: 5px;
	}

	#notes {
		color: rgb(0, 0, 0, 0.5);
		font-size: small;
		text-decoration: underline;
	}

	#separator {
		width: 95%;
		height: 1px;
		background-color: rgb(0, 0, 0, 0.5);
		margin-left: auto;
		margin-right: auto;
		margin-top: 5px;
		margin-bottom: 5px;
	}

	#content {
		margin-left: 15px;
	}
</style>

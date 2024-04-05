<script>
	export let mark;
	export let prof;
	export let date;
	export let notes;

	let up = false;
	let arrowPath =
		'M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z';
	let svg;
</script>

<div id="container">
	<div id="main">
		<h1 id="mark">{mark}</h1>
		<h2>/ 20</h2>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="50"
			height="50"
			fill="currentColor"
			class="bi bi-arrow-up-square"
			viewBox="0 0 16 16"
			bind:this={svg}
			on:click={() => {
				if (up) {
					svg.style.transform = 'rotate(0deg)';
					svg.style.transition = 'transform 0.5s ease-in-out';
					up = false;
				} else {
					svg.style.transform = 'rotate(180deg)';
					svg.style.transition = 'transform 0.5s ease-in-out';
					up = true;
				}
			}}
		>
			<path fill-rule="evenodd" d={arrowPath} />
		</svg>
	</div>

	<div id="details" class="card {!up ? 'hidden' : 'visible'}">
		<p>{prof}</p>
		<p id="date">{date}</p>
		<div id="separator"></div>
		<p id="notes">Notes</p>
		<p id="content">{notes}</p>
	</div>
</div>

<style>
	.hidden {
		overflow: hidden;
		transition: all 0.5s ease-in-out;
		height: 0;
	}

	.visible {
		height: 150px;
		overflow: hidden;
		transition: all 0.5s ease-in-out;
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
		overflow-y: hidden;
		opacity: 1;
		animation: fade 1s linear;
	}

	#main {
		display: flex;
		flex-direction: row;
	}

	#mark {
		font-weight: bolder;
		font-size: 50px;
	}

	@keyframes fade {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	h2 {
		font-size: x-large;
		color: rgb(0, 0, 0, 0.5);
		margin-top: 10%;
		margin-left: 2%;
	}

	svg {
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

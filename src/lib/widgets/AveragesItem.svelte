<script>
	export let course;
	export let average;

	let iconPath =
		'm.334 0 4.358 4.359h7.15v7.15l4.358 4.358V0zM.2 9.72l4.487-4.488v6.281h6.28L6.48 16H.2z'; // to change depending on the course
	// ideally a database element that links the course to its icon's SVG path

	let valueBar;
	let valueWidth = ((average / 20) * 100).toString();

	$: if (valueBar) {
		valueBar.style.width = valueWidth + '%';
	}
</script>

<div id="container">
	<div id="name">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-amd"
			viewBox="0 0 16 16"
		>
			<path d={iconPath} />
		</svg>
		<p>{course}</p>
	</div>
	<div id="average-bar"><div id="value-bar" bind:this={valueBar}></div></div>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		width: 80%;
		margin: 10px;
		z-index: 10;
	}

	#name {
		display: flex;
		flex-direction: row;
		font-size: large;
		margin-bottom: 2px;
		margin-left: 10px;
	}

	p {
		margin-left: 10px;
		color: rgb(0, 0, 0, 0.5);
	}

	#average-bar {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 15px;
		height: 20px;
		width: 100%;
		margin-top: 2px;
	}

	#value-bar {
		background-color: blue;
		border-radius: 15px;
		height: 20px;
	}
</style>

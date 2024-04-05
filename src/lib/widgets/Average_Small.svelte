<script>
	import { user, currentView, currentContent } from "../../store";

	let score = null;
	let maxScore = null;

	$: {
		const values = $user;
		if (values) {
			if ($currentView === "dashboard") {
				score = $user["globalAverage"][0]
				maxScore = $user["globalAverage"][1]
			} else if ($currentContent !== null) {
				score = $currentContent["average"][0]
				maxScore = $currentContent["average"][1]
			}
		}
	}
</script>

<div id="container">
	<p class="widgetTitle">Average</p>
	<p id="average">{score}</p>
	<p id="out-of">/{maxScore}</p>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}

	#average {
		text-align: center;
		margin-top: auto;
		font-size: 6.5rem;
		font-weight: bold;
		margin-top: -5%;
	}

	#out-of {
		text-align: right;
		font-size: 1.5rem;
		margin-right: 10%;
		margin-top: -10%;
		color: rgb(0, 0, 0, 0.5);
	}
</style>

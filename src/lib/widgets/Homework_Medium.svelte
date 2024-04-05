<script>
	import HomeworkItem from './HomeworkItem.svelte';
</script>

<div id="container">
	<h1 id="title">Homework</h1>
	<HomeworkItem date="28/03/2024" tasks={['Exercise 1', 'Learn lesson']} givenDate="07/03/2024"
	></HomeworkItem>
	<HomeworkItem
		date="14/04/2024"
		tasks={['Exercise 7', 'Say sike right now']}
		givenDate="21/03/2024"
	></HomeworkItem>
</div>

<style>
	#container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow-y: auto;
		height: 350px;
		width: 350px;
	}

	#title {
		text-align: center;
		font-family: 'SF Pro Display';
		font-weight: normal;
		color: rgb(0, 0, 0, 0.5);
		font-size: 20px;
		margin-top: 10px;
		margin-bottom: 20px;
	}
</style>

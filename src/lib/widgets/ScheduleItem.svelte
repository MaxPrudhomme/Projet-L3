<script>
	import Icon from '$lib/Icon.svelte';

	export let name = 'Undefined'; // name of the item  (ex: "CM - Database")
	export let location = 'Undefined'; // name of the place (ex: "Amphi L001")
	export let icon = 'slash-square'; // location of the icon file
	export let color = 'white'; // background color
	export let height = '1'; // height of the item
	export let pos = '1'; // vertical position of the item on the schedule
	export let overlap = 1;

	let itemRef;

	$: {
		if (itemRef) {
			itemRef.style.backgroundColor = color;
			itemRef.style.gridRow = pos + '/' + (pos - height);
			itemRef.style.gridColumn = overlap + '/ 12';
			itemRef.style.zIndex = 2;
			// itemRef.style.marginLeft = 'calc(30px + ' + left + ')';
		}
	}

	function bringToFront(event) {
		itemRef.style.zIndex += 20;
	}
	// peut être juste un dépliage en hover ?
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<button class="buttonReset" id="schedule-item" bind:this={itemRef} on:click={bringToFront}>
	<div id="align">
		<div id="icon"><Icon name={icon} /></div>

		<div>
			<h1>{name}</h1>
			<p>{location}</p>
		</div>
	</div>
</button>

<style>
	@import '../../global.css';

	#schedule-item {
		border-radius: 10px;
		padding: 10px;
		margin-right: 5%;
		position: relative;
		filter: saturate(75%);

		font-family: Arial, Helvetica, sans-serif;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
		overflow-x: scroll;
	}

	#schedule-item::-webkit-scrollbar {
		/* Hide scrollbar for Chrome, Safari and Opera */
		display: none;
	}

	#align {
		display: flex;
	}

	#icon {
		margin-right: 10px;
	}

	h1 {
		margin-top: -5px;
		margin-bottom: 5px;
		font-size: large;
		text-wrap: wrap;
	}

	p {
		text-wrap: wrap;
	}
</style>

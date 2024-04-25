<script>
	import Icon from '$lib/Icon.svelte';

	export let name = 'Undefined'; // name of the item  (ex: "CM - Database")
	export let location = 'Undefined'; // name of the place (ex: "Amphi L001")
	export let icon = 'slash-square'; // location of the icon file
	export let color = 'white'; // background color
	export let height = '25%'; // height of the item (TO BE REPLACED BY AN ACTUAL MEASURE OF TIME)
	export let pos = '50%'; // vertical position of the item on the schedule (TO BE REPLACED BY AN ACTUAL MEASURE OF TIME)
	export let overlap = 1;

	let itemRef;

	$: if (itemRef) {
		itemRef.style.backgroundColor = color;
		itemRef.style.height = height;
		itemRef.style.top = pos;
		itemRef.style.width = 'calc(80% /' + { overlap } + ')';
	}
</script>

<div id="schedule-item" bind:this={itemRef}>
	<div id="align">
		<div id="icon"><Icon name={icon} /></div>

		<div>
			<h1>{name}</h1>
			<p>{location}</p>
		</div>
	</div>
</div>

<style>
	#schedule-item {
		border-radius: 10px;
		/* width: calc(70% - 30px); to make responsive if multiple items at the same height/time */
		padding: 10px;
		z-index: 2;
		position: absolute;
		margin-left: 45px;
		margin-top: 0;
		margin-bottom: 0;

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

<script>
	import Widget from './Widget.svelte';
	import Grid, { GridItem } from 'svelte-grid-extended';
	import {
		matrixRepresentation,
		widgets,
		interactionActive,
		widgetEdit,
		currentView,
		userUid
	} from '../../store';
	import { derived } from 'svelte/store';
	import { v4 } from 'uuid';
	import { onMount } from 'svelte';
	import { getDoc, doc } from 'firebase/firestore';

	let matrix = [];
	let widgetType = null;
	let widgetName = 'Select a Widget';
	let widgetDescription = '------------------';
	let availableSizes = ['---', '---', '---'];
	let currentSize = null;
	const itemSize = { width: 170, height: 170 };

	$: {
		matrix = $matrixRepresentation;
	}

	const computeMatrixRepresentation = derived(widgets, ($widgets) => {
		const numRows = 4;
		const numCols = 7;

		const matrix = Array.from({ length: numRows }, () => Array(numCols).fill(0));

		$widgets.forEach((widget) => {
			const endRow = Math.min(widget.y + widget.h, numRows);
			const endCol = Math.min(widget.x + widget.w, numCols);

			for (let i = widget.y; i < endRow; i++) {
				for (let j = widget.x; j < endCol; j++) {
					matrix[i][j] = 1;
				}
			}
		});

		return matrix;
	});
	console.log($widgets);

	computeMatrixRepresentation.subscribe((value) => {
		matrixRepresentation.set(value);
	});

	let widgetsLibrary = [
		{ x: 0, y: 0, w: 1, h: 1, content: ['exam', 's'] },
		{ x: 1, y: 0, w: 1, h: 1, content: ['average', 's'] },
		// { x: 2, y: 0, w: 1, h: 2, content: ["notifications", "h"] },
		{ x: 0, y: 1, w: 2, h: 1, content: ['lastmark', 'l'] },
		{ x: 3, y: 0, w: 2, h: 4, content: ['schedule', 't'] },
		{ x: 3, y: 4, w: 4, h: 4, content: ['schedule', 'f'] },
		{ x: 5, y: 0, w: 2, h: 4, content: ['homework', 't'] },
		{ x: 2, y: 0, w: 1, h: 1, content: ['vacations', 's'] },
		{ x: 0, y: 2, w: 2, h: 4, content: ['marks', 't'] },
		// Décommenter ci dessous si le onMount fonctionne pas
		{ x: 2, y: 1, w: 1, h: 1, content: ['averageteacher', 's'] },
		{ x: 0, y: 6, w: 2, h: 2, content: ['examteacher', 'm'] },
		{ x: 0, y: 8, w: 2, h: 4, content: ['homeworkteacher', 't'] },
		{ x: 2, y: 8, w: 2, h: 4, content: ['markteacher', 't'] },
		{ x: 4, y: 8, w: 2, h: 4, content: ['scheduleform', 't'] }
		/////////////////////////////////////////////////
	];

	// mettre tout ça en commentaire si le onMount fonctionne pas
	// let teacherWidgetsLibrary = [
	// 	{ x: 2, y: 1, w: 1, h: 1, content: ['averageteacher', 's'] },
	// 	{ x: 0, y: 6, w: 2, h: 2, content: ['examteacher', 'm'] },
	// 	{ x: 0, y: 8, w: 2, h: 4, content: ['homeworkteacher', 't'] },
	// 	{ x: 2, y: 8, w: 2, h: 4, content: ['markteacher', 't'] },
	// 	{ x: 4, y: 8, w: 2, h: 4, content: ['scheduleform', 't'] }
	// ];

	// onMount(async () => {
	// 	if ($currentView != 'dashboard') {
	// 		const courseData = (await getDoc(doc(db, 'courses', $currentView))).data();

	// 		if (courseData.teachers.find((teacher) => teacher.path.slice(8) == $userUid)) {
	// 			widgetsLibrary.concat(teacherWidgetsLibrary);
	// 		}
	// 	}
	// });
	//////////////////////////////////////////////////////////////

	const sizeGuide = {
		s: [1, 1],
		l: [2, 1],
		h: [1, 2],
		m: [2, 2],
		t: [2, 4],
		f: [4, 4]
	};

	const widgetsData = {
		schedule: [
			'Schedule Widget',
			'The schedule widget allows you to see in real time your schedule for the day or the week. The weekly view is only available on the Extra Large Schedule',
			['Large', 'Tall', 'Extra Large']
		],
		average: [
			'Average Widget',
			'The average widget allows you to see at a glance your average grade for courses. The tall average view is only available for the dashboard version, displaying all the averages.',
			['Small', 'Tall']
		],
		notifications: [
			'Notification Widget',
			'The notification widget is connected to the communication tab below. Any new announcement or poll with trigger a notifications. Clicking on the widget will bring you to the communication tab.',
			['Small']
		],
		lastmark: [
			'Last Mark Widget',
			'The last mark widget displays your 5 latests grades in your courses. The main dashboard version displays the 5 latest grades out of all the followed courses.',
			['Small', 'Large']
		],
		vacations: [
			'Vacations Widget',
			'The vacations widget adds a countdown until the next vacations. Only available on the main dashboard.',
			['Small', 'Large']
		],
		homework: [
			'Homework Widget',
			'The homework widgets shows the upcoming homework from the teacher as well as personnal homework. The status can be update when clicking on the top left icon.',
			['Medium', 'Tall']
		],
		exam: [
			'Exam Widget',
			'The exam widget shows the time left before the next upcoming exam?',
			['Small']
		],
		marks: ['Marks Widget', 'The marks widget shows the marks the user received', ['Tall']],
		averageteacher: [
			'Average Widget (teacher)',
			'This average widget displays the class average for the course',
			['Small']
		],
		examteacher: [
			'Exam Widget (teacher)',
			'This exam widget displays every exam existing for the course, as well as allows the creation of new exams',
			['Medium']
		],
		homeworkteacher: [
			'Homework Widget (teacher)',
			'This homework widget shows the homework given to the entire class. New homework to give to all the students can also be added',
			['Tall']
		],
		markteacher: [
			'Mark Widget (teacher)',
			'This mark widget displays the class average for each exam, as well as individual marks. New marks can also be added or modified thanks to the built-in form',
			['Tall']
		],
		scheduleform: [
			'Schedule Form Widget (teacher)',
			'The schedule form widget allows the user to add a new item to the schedule',
			['Tall']
		]
	};

	function selectWidget(data) {
		console.log(data);
		widgetName = widgetsData[data[0]][0];
		widgetDescription = widgetsData[data[0]][1];
		availableSizes = widgetsData[data[0]][2];
		widgetType = data[0];
		currentSize = data[1];
	}

	function addWidget() {
		// add the selected widget to the screen
		const result = findAvailablePosition(sizeGuide[currentSize][0], sizeGuide[currentSize][1]);

		if (result === null) {
			return;
		} else {
			const currentWidgets = $widgets;

			const newWidget = {
				id: v4(),
				x: result['col'],
				y: result['row'],
				w: sizeGuide[currentSize][0],
				h: sizeGuide[currentSize][1],
				content: [widgetType, currentSize]
			};
			widgets.set([...currentWidgets, newWidget]);
		}
	}

	function leaveBrowser() {
		// leaves widget browser
		console.log('leaving browser');
		interactionActive.set(false);
		widgetEdit.set(false);
		console.log($interactionActive, $widgetEdit);
	}

	function findAvailablePosition(w, h) {
		// returns the first available position where the chosen widget can be placed

		const rows = 4; // hard coded for now, but it is planned to make those values changeable depending on the user's screen size
		const cols = 7;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j < cols; j++) {
				if (i + h <= rows && j + w <= cols) {
					let isAvailable = true;
					for (let x = i; x < i + h; x++) {
						for (let y = j; y < j + w; y++) {
							if (matrix[x][y] !== 0) {
								isAvailable = false;
								break;
							}
						}
						if (!isAvailable) break;
					}
					if (isAvailable) {
						return { row: i, col: j };
					}
				}
			}
		}
		return null;
	}

	function removeWidget() {
		// removes the selected widget from the screen if it has already been loaded
		widgets.update((widgetsStore) => {
			return widgetsStore.filter((widget) => {
				if (
					widget.content &&
					widget.content[0] === widgetType &&
					widget.content[1] === currentSize
				) {
					return false;
				}
				return true;
			});
		});
	}
</script>

<div id="container">
	<div id="infoContainer">
		<h1 id="widgetName">{widgetName}</h1>
		<p id="widgetDescription">{widgetDescription}</p>
		<h3 id="sizeLabel">Available Sizes</h3>
		<ul id="widgetSizes">
			{#each availableSizes as size}
				<li>{size}</li>
			{/each}
		</ul>
		<div id="buttonContainer">
			<button id="addButton" on:click={addWidget}>Add</button>
			<button id="addButton" on:click={removeWidget}>Remove</button>
		</div>
	</div>
	<div id="grid">
		<Grid class="grid-container" rows={12} cols={7} {itemSize} gap={20} collision="none">
			{#key widgetsLibrary}
				{#each widgetsLibrary as item}
					<GridItem
						bind:x={item.x}
						bind:y={item.y}
						bind:w={item.w}
						bind:h={item.h}
						resizable={false}
						movable={false}
					>
						<button class="content" on:click={() => selectWidget(item.content)}>
							<Widget content={item.content} disabled={true}></Widget>
						</button>
					</GridItem>
				{/each}
			{/key}
		</Grid>
	</div>

	<button id="leaveButton" on:click={leaveBrowser}>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			fill="black"
			viewBox="0 0 16 16"
		>
			<path
				d="M8.538 1.02a.5.5 0 1 0-.076.998 6 6 0 1 1-6.445 6.444.5.5 0 0 0-.997.076A7 7 0 1 0 8.538 1.02"
			/>
			<path
				d="M7.096 7.828a.5.5 0 0 0 .707-.707L2.707 2.025h2.768a.5.5 0 1 0 0-1H1.5a.5.5 0 0 0-.5.5V5.5a.5.5 0 0 0 1 0V2.732z"
			/>
		</svg>
	</button>
</div>

<style>
	#leaveButton {
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
		transition: all 0.5s ease;
		margin: 5px;
		height: 32px;
		opacity: 0.7;
		margin-top: 40px;
		margin-left: 30px;
	}

	#leaveButton:hover {
		opacity: 1;
	}

	#widgetName {
		text-align: center;
		margin-top: 25px;
	}

	#widgetDescription {
		padding: 20px;
		text-align: center;
	}

	#sizeLabel {
		margin-left: 35px;
	}

	#widgetSizes {
		margin-top: 15px;
		margin-left: 60px;
	}

	#buttonContainer {
		display: flex;
		justify-content: center;
	}

	#addButton {
		margin: 10px;
		font-size: 16px;
		width: 70px;
		height: 28px;
		border-radius: 5px;
		border: none;
		background-color: rgba(255, 255, 255, 0.6);
		transition: all 0.5s ease-in-out;
		cursor: pointer;
	}

	#addButton:hover {
		background-color: rgba(255, 255, 255, 0.9);
	}

	#container {
		display: flex;
	}

	#infoContainer {
		width: 325px;
		height: 820px;
	}

	#grid {
		height: 820px;
		width: 1340px;
		margin-left: 44px;
		margin-top: 25px;
		overflow-y: auto;
		overflow-x: hidden;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.content {
		height: 100%;
		width: 100%;
		border: none;
		background: none;
		padding: 0;
		margin: 0;
		cursor: pointer;
	}
</style>

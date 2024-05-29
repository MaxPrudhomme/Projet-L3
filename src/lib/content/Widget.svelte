<script>
	import { onMount } from 'svelte';
	import AverageSmall from '$lib/widgets/Average_Small.svelte';
	import HomeworkTall from '$lib/widgets/Homework_Tall.svelte';
	import MarkLarge from '$lib/widgets/Mark_Large.svelte';
	import MarkTall from '$lib/widgets/Mark_Tall.svelte';
	import ScheduleTall from '$lib/widgets/Schedule_Tall.svelte';
	import ScheduleFat from '$lib/widgets/Schedule_Fat.svelte';
	import ScheduleLarge from '$lib/widgets/Schedule_Large.svelte';
	import ExamSmall from '$lib/widgets/Exam_Small.svelte';
	import VacationsSmall from '$lib/widgets/Vacations_Small.svelte';

	import ExamMediumTeacher from '$lib/widgets/teacher/Exam_Medium_Teacher.svelte';
	import HomeworkTallTeacher from '$lib/widgets/teacher/Homework_Tall_Teacher.svelte';
	import AverageSmallTeacher from '$lib/widgets/teacher/Average_Small_Teacher.svelte';
	import MarkTallTeacher from '$lib/widgets/teacher/Mark_Tall_Teacher.svelte';
	import LastMarksMedium from '$lib/widgets/LastMarks_Medium.svelte';
	import Schedule_Form_Tall from '$lib/widgets/teacher/Schedule_Form_Tall.svelte';

	export let content;
	export let disabled = false;

	let containerRef;
	let blockerRef;
	let CurrentWidget;

	// Map to link content types to widget components
	const widgetMap = {
		'average-s': AverageSmall,
		'homework-t': HomeworkTall,
		'lastmark-l': MarkLarge,
		'marks-t': MarkTall,
		'exam-s': ExamSmall,
		'vacations-s': VacationsSmall,

		'schedule-t': ScheduleTall,
		'schedule-f': ScheduleFat,
		'schedule-l': ScheduleLarge,

		'examteacher-m': ExamMediumTeacher,
		'homeworkteacher-t': HomeworkTallTeacher,
		'averageteacher-s': AverageSmallTeacher,
		'markteacher-t': MarkTallTeacher,
		'scheduleform-t': Schedule_Form_Tall
	};

	// Initialize the widget based on content type when the component mounts
	onMount(() => {
		let target = content[0] + '-' + content[1];
		CurrentWidget = widgetMap[target]; // Dynamically set the widget based on the provided content type
	});
</script>

<!-- <div id="container" bind:this={containerRef}>
	{#if disabled}
		<div id="blocker" bind:this={blockerRef} style="visibility: visible;"></div>
	{:else}
		<div id="blocker" bind:this={blockerRef} style="visibility: hidden;"></div>
	{/if}

	{#if CurrentWidget}
		<CurrentWidget />
	{/if}
</div> -->

{#if disabled}
	<div id="container" class="blocker" bind:this={containerRef}>
		{#if CurrentWidget}
			<CurrentWidget />
		{/if}
	</div>
{:else}
	<div id="container" bind:this={containerRef}>
		{#if CurrentWidget}
			<CurrentWidget />
		{/if}
	</div>
{/if}

<style>
	#container {
		display: inline-flex;
		position: relative;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 20px;
		height: 100%;
		width: 100%;
		scrollbar-width: none;
		overflow: hidden;
	}

	.blocker {
		pointer-events: none;
	}
</style>

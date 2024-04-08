<script>
    export let author = null;
    export let givenDate = null;
    export let dueDate = null;
    export let status = null;
    export let tasks = null;
    export let id = null;

    import { onMount } from "svelte";
    import Icon from "$lib/Icon.svelte";

    let dueDateColorClass = '';
    let displayDueDate = ''; 

    function changeStatus() {
        status = !status;
        dueDateColorClass = status ? 'confirmGreenColor' : '';
    }

    function formatDueDate(dueDateString) {
        const [day, month, year] = dueDateString.split('/').map(num => parseInt(num, 10));
        const dueDate = new Date(year, month - 1, day);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (dueDate.getTime() === today.getTime()) {
            return 'Today';
        } else if (dueDate.getTime() === tomorrow.getTime()) {
            return 'Tomorrow';
        } else {
            return dueDateString; 
        }
    }

    onMount(() => {
        dueDateColorClass = status ? 'confirmGreenColor' : '';
        displayDueDate = formatDueDate(dueDate);
    });
</script>

<div id="container">
    <div id="statusContainer">
        <button class="buttonReset" on:click={changeStatus}>
            {#if status} 
            <Icon name={"check-lg"} class={"s36x36 t500 confirmGreenFilter"}></Icon>
            {:else if !status && author}
                <Icon name={"person-circle"} class={"s36x36 t500"}></Icon>
            
            {:else if !status && !author}
                <Icon name={"person-workspace"} class={"s36x36 t500"}></Icon>    
            {/if}
        </button>
        <p id="dueDate" class={dueDateColorClass}>due {displayDueDate}</p>
    </div>
    <ul>
        {#each tasks as task} 
            <li>{task}</li>
        {/each}
    </ul>
    <p id="givenDate">given {givenDate}</p>
</div>


<style>
	#container {
		background-color: rgb(255, 255, 255, 0.5);
		border-radius: 10px;
		width: 80%;
		margin: auto;
		margin-top: 10px;
		padding: 10px;
	}

	#statusContainer {
		display: flex;
	}

	#dueDate {
		margin-left: 0.5rem;
		margin-top: 0.2rem;
		font-size: 1.3rem;
		transition: all 0.15s ease;
	}

	#givenDate {
		text-align: right;
		color: rgba(0, 0, 0, 0.7);
	}

	ul {
		margin-top: 0.3rem;
		margin-left: 2rem;
	}
</style>

<script>
    import Icon from '$lib/Icon.svelte';
    import { db } from '$lib/firebase';
    import { currentView, currentContent, userUid } from '../../store';
    import { doc, updateDoc } from 'firebase/firestore';
    import { v4 } from 'uuid';
    import { Timestamp } from 'firebase/firestore';
    import { fly } from 'svelte/transition';

    export let refresh;
    export let state;
    
    let list = [];
    let dueDate;
    let taskInput;
    let taskContainer;

    const today = new Date()

    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();

    function handleKeyDown(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (taskInput.value.trim() !== '') {
                const content = taskInput.value.trim();
                list = [...list, { content, editable: false }];
                taskInput.value = ''; 
                taskInput.focus();
            }
        }
    }

    function toggleEdit(index) {
        list[index].editable = !list[index].editable;
    }

    function handleKeyDownForEdit(event, index) {
        if (event.key === 'Enter') {
            toggleEdit(index);
        }
    }

    function adjustTextareaHeight(event) {
        const textarea = event.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    async function submitHomework() {
        if (!dueDate) {
            alert("Please select a due date.");
            return;
        }

        if (taskInput.value.trim() !== '') {
            list = [...list, { content: taskInput.value.trim(), editable: false }];
            taskContainer.style.display = 'none';
        }

        if (list.length === 0 || list.every(task => !task.content.trim())) {
            alert("Please add at least one task.");
            return;
        }

        const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView);

        const tasks = list.map(task => task.content);

        const newHomework = {
            author: true,
            dueDate: Timestamp.fromDate(new Date(dueDate)),
            givenDate: Timestamp.fromDate(today),
            status: false,
            tasks: tasks
        };

        const homeworkId = v4()

        await updateDoc(targetRef, {
            [`homework.${homeworkId}`]: newHomework
        });
        refresh.set(true)
        state.set(false)
        
        currentContent.update(content => {
            if (!content.homework || typeof content.homework !== 'object') {
                content.homework = {};
            }
            content.homework[homeworkId] = newHomework;
            return content;
        });
    }
</script>

<form transition:fly={{duration: 250, x: -300}}>
    <div id="dueInput">            
        <button class="buttonReset" on:click={submitHomework}>
            <Icon name={"check-circle"} class={"s36x36 t500"}></Icon>
        </button>
        <p class="dueText" id="dueLabel">due</p>
        <input class="dueText inputReset" type="date" min={`${year}-${month}-${day}`} bind:value={dueDate}>
    </div>
    <ul>
        <!-- List items will be dynamically added here -->
        {#each list as task, index}
            <li>
                {#if task.editable}
                    <textarea bind:value={task.content} class="inputReset" on:blur={() => toggleEdit(index)} on:input={adjustTextareaHeight}></textarea>
                {:else}
                    <span role="button" on:click={() => toggleEdit(index)} on:keydown={(event) => handleKeyDownForEdit(event, index)} tabindex="0">{task.content}</span>
                {/if}
            </li>
        {/each}
        <li bind:this={taskContainer}>
            <textarea bind:this={taskInput} class="inputReset" placeholder="Add a task" on:keydown={handleKeyDown} on:input={adjustTextareaHeight}></textarea>
        </li>
    </ul>
    <p id="givenDate">given {`${day}/${month}/${year}`}</p>
</form>

<style>
    form {
        background-color: rgb(255, 255, 255, 0.5);
        border-radius: 10px;
        width: 80%;
        margin: auto;
        margin-top: 10px;
        padding: 10px;
        transition: all 0.5s ease;
        height: auto;
    }

    #dueInput {
        display: flex;
    }

    .dueText {
        font-size: 1.3rem;
        margin-top: 0.2rem;
        height: 1.5rem;
        transition: all 0.15s ease;
    }

    #dueLabel {
        margin-left: 0.5rem;
        margin-right: 0.2rem;
    }

    ul {
        margin-top: 0.3rem;
        margin-left: 2rem;
    }

    li {
        width: 90%;
        overflow-wrap: break-word;
    }

    li > * {
        vertical-align: text-top;
    }

    li:hover {
        cursor: text;
    }

    textarea {
        resize: none;
        overflow-y: hidden;
        overflow-wrap: break-word;
        width: 100%;
    }

    #givenDate {
        text-align: right;
        color: rgba(0, 0, 0, 0.7);
    }

</style>

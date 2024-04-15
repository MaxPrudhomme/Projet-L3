<script>
    import HomeworkItem from './Homework_Item.svelte';
    import HomeworkForm from './Homework_Form.svelte'
    import { currentContent, currentView, userUid } from '../../store';
    import { onMount } from 'svelte';
    import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
    import { db } from '$lib/firebase';
    import Icon from '$lib/Icon.svelte';
    import { writable } from 'svelte/store';
    export const state = writable(false);
    export const refresh = writable(false);

    let homework = new Map();
    let firestoreSnapshot =  new Map();
    let toggleButton;
    const today = new Date().setHours(0, 0, 0, 0)

    function sortHomeworkByDueDate(homeworkMap) {
        return new Map([...homeworkMap.entries()].sort((a, b) => {
            return a[1].dueDate - b[1].dueDate;
        }));
    }

    async function loadContent() {
        let existingHomework = $currentContent["homework"]

        Object.entries(existingHomework).forEach(([id, item]) => {
            if (item.dueDate.toDate().setHours(0, 0, 0, 0) < today && item.status) {
                delete existingHomework[id]
            }
        })

        const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView)
        await updateDoc(targetRef, {
            homework: existingHomework
        })

        try {
            const courseRef = collection(db, 'courses', $currentView, 'homework');
            const q = query(courseRef, orderBy('dueDate'));
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.status = data.status[$userUid];
                if (!data.status || data.dueDate.toDate().setHours(0, 0, 0, 0) >= today) {
                    homework.set(doc.id, data)
                }
            });

            firestoreSnapshot = new Map(homework)

            if (existingHomework && typeof existingHomework === 'object') {
                Object.entries(existingHomework).forEach(([id, data]) => {
                    homework.set(id, data);
                });
            }
            let sorted = sortHomeworkByDueDate(homework);
            homework = new Map(sorted);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    }

    onMount(async () => {
        await loadContent();
    })

    $: {
        if ($refresh) {
            let temp = $currentContent["homework"];
            let tempMap = new Map();
            if (temp && typeof temp === 'object') {
                Object.entries(temp).forEach(([key, value]) => {
                    tempMap.set(key, value);
                });
            }
            homework = sortHomeworkByDueDate(new Map([...tempMap, ...firestoreSnapshot]));
            refresh.set(false)
        } 
    }

    function toggleNewHomework() {
        state.set(!$state)
    }
</script>

<div id="container">
    <h1 class="widgetTitle">Homework</h1>
    <div id="homeworkContainer">
        {#key homework} 
            {#each [...homework] as [id, {author, givenDate, dueDate, status, tasks}]}	 
                <HomeworkItem {id} {author} {givenDate} {dueDate} {status} {tasks}></HomeworkItem>
            {/each}

            {#if $state}
                <HomeworkForm {refresh} {state}></HomeworkForm>
            {/if}
        {/key}
        <button class="buttonReset addButton" on:click={toggleNewHomework} bind:this={toggleButton} class:rotate-45deg={$state}>
            <Icon name={"plus-circle-dotted"} class={"s32x32"}></Icon>
        </button>
    </div>
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        overflow: auto;
    }

    #container::-webkit-scrollbar {
        display: none;
    }

    #container::-webkit-scrollbar-thumb {
        display: none;
    }

    #homeworkContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .addButton {
        margin: auto;
        margin-top: 1rem;
        opacity: 0.8;
        transition: all 0.5s ease;
    }

    .addButton:hover {
        opacity: 1;
    }

    .rotate-45deg {
      transform: rotate(45deg);
    }

</style>

<script>
    export let author = null;
    export let givenDate = null;
    export let dueDate = null;
    export let status = null;
    export let tasks = null;
    export let id = null;

    import Icon from "$lib/Icon.svelte";
    import { onMount } from "svelte";
    import { db } from "$lib/firebase";
    import { userUid, currentView } from "../../store";
    import { doc, getDoc, updateDoc } from "firebase/firestore";
    import { fly } from "svelte/transition";

    let dueDateColorClass = '';
    let dueDateColorFilter = '';
    let displayDueDate = '';
    let displayGivenDate = '';

    async function changeStatus() {
        status = !status;
        dueDateColorClass = status ? 'confirmGreenColor' : '';
        if (author) {
            const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView)
            const content = (await getDoc(targetRef)).data()
            if (content["homework"][id]["dueDate"].toDate().setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                delete content["homework"][id];
                await updateDoc(targetRef, {
                    homework: content["homework"]
                });
            } else {
                await updateDoc(targetRef, {
                    ["homework." + id + ".status"]: !content["homework"][id]["status"]
                })
            }

        } else {
            const targetRef = doc(db, 'courses', $currentView, 'homework', id)
            let content = (await getDoc(targetRef)).data()["status"]
            content[$userUid] = !content[$userUid]

            await updateDoc(targetRef, {
                ["status"]: content
            });
        }
    }

    function basicDate(timestamp) {
        const dateObj = timestamp.toDate();
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function formatDate(timestamp) {
        const dateObj = timestamp.toDate();
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        today.setHours(0, 0, 0, 0);
        dateObj.setHours(0, 0, 0, 0);
        tomorrow.setHours(0, 0, 0, 0);

        if (dateObj < today) {
            return 'Past Due';
        } else if (isSameDate(dateObj, today)) {
            return 'Today';
        } else if (isSameDate(dateObj, tomorrow)) {
            return 'Tomorrow';
        } else {
            return basicDate(timestamp);
        }
    }


    function isSameDate(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    onMount(() => {
        displayDueDate = formatDate(dueDate);
        displayGivenDate = basicDate(givenDate);
        dueDateColorClass = status ? 'confirmGreenColor' : '';
        if (!status) {
            dueDateColorClass = displayDueDate === 'Past Due' ? 'alertRedColor' : '';
            dueDateColorFilter = displayDueDate === 'Past Due' ? 'alertRedFilter' : '';
        }
    });
</script>

<div id="container" out:fly={{duration: 250, x:-350}}>
    <div id="statusContainer">
        <button class="buttonReset" on:click={changeStatus}>
            {#if status} 
                <Icon name={"check-lg"} class={"s36x36 t500 confirmGreenFilter"}></Icon>
            {:else if !status && author}
                <Icon name={"person-circle"} class={"s36x36 t500 " + dueDateColorFilter}></Icon>
            {:else if !status && !author}
                <Icon name={"person-workspace"} class={"s36x36 t500 " + dueDateColorFilter}></Icon>    
            {/if}
        </button>
            <p id="dueDate" class={dueDateColorClass}>{#if displayDueDate !== 'Past Due'}due {/if}{displayDueDate}</p>
    </div>
    <ul>
        {#each tasks as task} 
            <li>{task}</li>
        {/each}
    </ul>
    {#if typeof displayGivenDate === 'string'}
        <p id="givenDate">given {displayGivenDate}</p>
    {/if}
</div>

<style>
    #container {
        background-color: rgb(255, 255, 255, 0.5);
        border-radius: 10px;
        width: 80%;
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

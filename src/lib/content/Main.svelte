<script>
    // Content imports
    import Scrollbar from "./Scrollbar.svelte";
    import WidgetTab from "./WidgetTab.svelte";
    import FileTab from "$lib/files/FileTab.svelte";

    // Store imports
    import { currentTab, currentContent, currentView, userUid, user, widgets } from "../../store";
    import { db } from "$lib/firebase";

    // Other Imports
	import { onMount } from "svelte";
    import { doc, getDoc } from "firebase/firestore";
    import { fly } from "svelte/transition";

    // Executes when the component mounts, fetching user data from Firestore
    onMount(async () => {
        try {   
            const userRef = doc(db, 'users', $userUid)
            const userData = (await getDoc(userRef)).data()
            currentContent.set(userData["content"]) // Set the initial content based on user data
            user.set(userData) // Update user store with fetched user data
            widgets.set(userData["dashboard"]) // Set initial widgets for the dashboard
        } catch(e) {
            console.log("Error : ", e)
        }
    });

    // Function to load view-specific data, handles both dashboard and course views
    async function load(view) {
        widgets.set([])   // Clear current widgets before loading new ones, required for some obscure reasons

        setTimeout(async () => {
            if (view === "dashboard") {
                const userRef = doc(db, 'users', $userUid);
                const userData = (await getDoc(userRef)).data();
                currentContent.set(userData["content"]) // Loads content from the content array in the user file for dashboard widgets
                widgets.set(userData["dashboard"]); // Loads widgets from the widget array in the user file to create widgets
            } else {
                const viewRef = doc(db, 'users', $userUid, 'userCourses', view);
                const viewData = (await getDoc(viewRef)).data();
                currentContent.set(viewData) // Loads content in the userCourse file for course widgets. NOT FROM THE COURSE FILE
                widgets.set(viewData["widgets"]); // Loads the widgets from the userCourse file to create widgets
            }
        }, 375) // DONT MESS WITH THAT TIMER. BELOW 351 WILL BREAK THE DAMN THING. Its already janky enough
    }

    $: {
        load($currentView) // Reactive statement to load new view whenever currentView updates
    }

</script>

<div id="container">
    <div id="contentContainer">
        {#if $currentTab === 'widgets'}
            <div id="widgets"  in:fly={{duration: 400, y: -820}} out:fly={{duration: 400, y: -820}}>
                <WidgetTab></WidgetTab>
            </div>
        {:else if $currentTab === 'files'}
            <div id="files" in:fly={{duration: 400, y: 1640}} out:fly={{duration: 400, y: 1640}}>
                <FileTab></FileTab>
            </div>
        {/if}
    </div>
    <Scrollbar></Scrollbar>
</div>


<style>
    #container {
        height: 820px;
        width: 1465px;
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        overflow: hidden;
    }

    #contentContainer {
        position: relative;
        height: 51rem;
        width: 83rem;
    }

    #widgets {
        position: absolute;
    }
    
    #files {
        position: absolute;
    }
</style>
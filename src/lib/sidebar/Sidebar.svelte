<script>
    import SidebarUserInfo from "./SidebarUserInfo.svelte";
    import SidebarList from "./SidebarList.svelte";
    import SidebarMenu from "./SidebarMenu.svelte";
    import { fly } from 'svelte/transition'
    import { onMount } from "svelte";
    import { userUid, user, widgets } from "../../store";
    import { db } from "$lib/firebase";
    import { getDoc, doc } from "firebase/firestore";

    onMount(async () => {
        try {
            const userRef = doc(db, 'users', $userUid)
            const userData = await getDoc(userRef)
            user.set(userData.data())
            widgets.set(userData.data()["dashboard"])
        } catch(e) {
            console.log("Error : ", e)
        }
    });

</script>

<div id="container" class="noise" in:fly={{ x: -1000, duration: 750, delay: 750}} out:fly={{ x: -1000, duration: 750}}>
    {#if $user}
        <SidebarUserInfo firstName={$user["name"]["first"]} lastName={$user["name"]["last"]}></SidebarUserInfo>
        <SidebarList></SidebarList>
        <SidebarMenu></SidebarMenu>
    {/if}
</div>

<style>
    #container {
        height: 820px;
        width: 335px;
        background-color: rgba(255, 255, 255, 0.55);
        position: relative;
        overflow: hidden; 
    }
</style>
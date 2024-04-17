<script>
    import SidebarUserInfo from "./SidebarUserInfo.svelte";
    import SidebarList from "./SidebarList.svelte";
    import SidebarMenu from "./SidebarMenu.svelte";
    import { user } from "../../store";

</script>

<div id="container" class="noise">
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
<script>
    const firstName = ''
    const lastName = ''
    import UserInfo from "./UserInfo.svelte";
    import { fly } from 'svelte/transition'
</script>

<div id="container" class="glass noise" transition:fly="{{ x: -1000, duration: 500 }}">
    <UserInfo {firstName} {lastName}></UserInfo>
</div>

<style>
    #container {
        height: 820px;
        width: 335px;
        background-color: rgba(255, 255, 255, 0.35);
        position: relative;
        overflow: hidden; 
    }
</style>
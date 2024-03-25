<script>
    const firstName = ''
    const lastName = ''
    import UserInfo from "./UserInfo.svelte";
</script>

<div id="container" class="glass">
    <UserInfo {firstName} {lastName}></UserInfo>
</div>

<style>
    #container {
        height: 100%;
        width: 18%;
        background-color: rgba(255, 255, 255, 0.55);
    }
</style>
<script>
    const firstName = ''
    const lastName = ''
    import UserInfo from "./UserInfo.svelte";
</script>

<div id="container" class="glass noise">
    <UserInfo {firstName} {lastName}></UserInfo>
</div>

<style>
    #container {
        height: 820px;
        width: 335px;
        background-color: rgba(255, 255, 255, 0.55);
    }
</style>
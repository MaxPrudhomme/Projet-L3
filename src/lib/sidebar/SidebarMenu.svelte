<script>
    import Icon from '$lib/Icon.svelte'
    import { currentView, user, userToken, userUid } from '../../store';

    function requestDashboard() {
        currentView.set("dashboard")
    }

    function logOut() {
        user.set(null)
        userToken.set(null)
        userUid.set(null)
    }

</script>

<div id="container">
    <button class="buttonReset">
        <Icon name={"gear-wide-connected"} class={"s36x36"}></Icon>
    </button>
    <button class="buttonReset" on:click={requestDashboard}>
        <Icon name={"house"} class={"s36x36"}></Icon>
    </button>
    <button class="buttonReset" on:click={logOut}>
        <Icon name={"power"} class={"s36x36"}></Icon>
    </button>
</div>

<style>
    #container {
        display: flex;
        justify-content: space-between;
        width: 265px;
        height: 32px;
        margin: auto;
        margin-top: 25px;
    }
</style>
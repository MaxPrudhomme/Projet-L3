<script>
    import Icon from '$lib/Icon.svelte'
    import { currentView } from '../../store';

    function requestDashboard() {
        currentView.set("dashboard")
    }

</script>

<div id="container">
    <button class="buttonReset">
        <Icon name={"gear-wide-connected"} class={"s32x32"}></Icon>
    </button>
    <button class="buttonReset"  on:click={requestDashboard}>
        <Icon name={"house"} class={"s32x32"}></Icon>
    </button>
    <button class="buttonReset">
        <Icon name={"power"} class={"s32x32"}></Icon>
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
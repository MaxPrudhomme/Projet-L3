<script>
    import Sidebar from "../lib/sidebar/Sidebar.svelte";
    import Main from "../lib/content/Main.svelte";
    import "../global.css";
</script>

<div id="container" class="absolute">
    <Sidebar></Sidebar>
    <Main></Main>
</div>

<style>
    #container {
        width: 90vw;
        height: 85vh;
        display: flex;
        overflow:hidden;
        border-radius: 25px;
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    }
</style>
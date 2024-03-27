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
        width: 1800px;
        height: 820px;
        display: flex;
        overflow:hidden;
        border-radius: 25px;
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.30);
    }
</style>
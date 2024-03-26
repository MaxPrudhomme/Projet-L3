<script>
    import Widget from "./Widget.svelte";    
    import { onMount } from 'svelte';

    let size="l";
    let content="";
</script>

<div id="container">
    <Widget {size} {content}></Widget>
</div>

<style>
    #container {
        display: grid;
        height: 90%;
        width: 90%;
        grid-template-columns: repeat(6, 1fr);
        grid-template-rows: repeat(4, 1fr);
        gap: 3.85%;
    }
</style>
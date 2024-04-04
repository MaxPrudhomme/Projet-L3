<script>
    export let subject = null;
    export let tag = null;
</script>

<div id="container">
    {#if tag}
        <h1>{tag}</h1>
    {:else} 
        <h1>{subject}</h1>
    {/if}
</div>

<style>
    #container {
        width: 275px;
        height: 60px;
        background-color: rgba(255, 255, 255, 0.3);    
        border-radius: 5px;
    }
    h1 {
        color: black;
        font-size: 30px;
    }
</style>
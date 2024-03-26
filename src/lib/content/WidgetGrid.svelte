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
    
    :global(.svlt-grid-shadow) {
    /* Back shadow */
    background: pink;
    }
  :global(.svlt-grid-container) {
    /* Container color */
    background: #eee;
  }
  :global(.svlt-grid-resizer::after) {
    /* Resizer color */
    border-color: white !important;
  }
</style>
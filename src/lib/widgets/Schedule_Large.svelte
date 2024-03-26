<script>
    let hours; 
</script>

<div id="container">
    <h1 id="title">Schedule</h1>
    <div id="schedule">  
        {#each {length:10} as _,i}
            <div id="separator"></div>
            <div id="hour-num">{i+8}</div>
        {/each}
    </div>
</div>


<style>
    /* #container {
        border-radius: 30px;
        background-color: rgba(255, 255, 255, 0.3);
        border: 1px solid white;
    } */

    #title {
        text-align: center;
        font-family: Arial, Helvetica, sans-serif;
        color: grey;
        font-size: large;
        margin-top: 10px;
        margin-bottom: 20px;
    }

    #separator {
        width: 350px;
        height: 3px;
        background-color: grey;
        margin-left: auto;
        margin-right: auto;
    }
    
    #hour-num {
        font-family: Arial, Helvetica, sans-serif;
        font-size: large;
        margin: 15px;
        color: grey;
    }
</style>
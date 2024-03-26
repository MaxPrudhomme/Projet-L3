<script>
    import ScheduleItem from "./ScheduleItem.svelte";
    let hours; 
</script>

<div id="container">
    <h1 id="title">Schedule</h1>
    <div id="schedule">  
        {#each {length:10} as _,i}
            <div id="separator"></div>
            <div id="hour-num">{i+8}</div>
        {/each}
        <ScheduleItem name="placeholder" place="A113" color="red" height="50px" pos="50px" icon="%sveltekit.assets%/favicon.png"></ScheduleItem>
    </div>
</div>


<style>
    #container {
        z-index: 1;
        position: relative;
    }

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
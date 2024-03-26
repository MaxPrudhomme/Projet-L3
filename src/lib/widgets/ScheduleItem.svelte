<script>
    export let name;    // name of the item  (ex: "CM - Database")
    export let place;   // name of the place (ex: "Amphi L001")
    export let icon;    // location of the icon file 
    export let color;   // background color
    export let height;  // height of the item (TO BE REPLACED BY AN ACTUAL MEASURE OF TIME)
    export let pos;     // vertical position of the item on the schedule (TO BE REPLACED BY AN ACTUAL MEASURE OF TIME)

    let itemRef;

    $: if (itemRef) {
        itemRef.style.backgroundColor = color;
        itemRef.style.height = height;
        itemRef.style.top = pos;
    }
</script>

<div id="schedule-item" bind:this={itemRef}>
    <div id="align">
        <img src={icon} alt="icon"/>
        <div>
            <h1>{name}</h1>
            <p>{place}</p>
        </div>   
    </div>
</div>

<style>
    #schedule-item {
        border-radius: 10px;
        width: 300px;           /* to make responsive if multiple items at the same height/time */
        padding: 10px;
        z-index: 2;
        position: absolute;
        margin-left: 45px;

        font-family: Arial, Helvetica, sans-serif;
    }

    #align {
        display: flex;
    }

    img {
        margin-right: 20px;
    }

    h1 {
        margin-top: -5px;
        margin-bottom: 5px;
        font-size: x-large;
    }

</style>
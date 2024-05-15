<script>
    import Icon from '$lib/Icon.svelte'
</script>

<button class="buttonReset">
    <Icon name={"plus-circle"} class={"s36x36"}></Icon>
    <p>Add a Course</p>
</button>

<style>
    button {
        border: 2px dashed black;
        border-radius: 10px;
        transition: all 0.5s ease;
        text-align: left;
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
        padding-left: 12px;
    }
    
    button:hover {
        background-color: rgba(255, 255, 255, 0.6);
    }

    p {
        color: black;
        font-size: 26px;
        margin-left: 10px;
    }
</style>
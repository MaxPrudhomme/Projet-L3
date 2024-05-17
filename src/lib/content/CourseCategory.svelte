<script>
    export let category
    export let courses
    export let selectedCourses

    import CourseItem from "./CourseItem.svelte";

</script>

<div id="container" class="noise">
    <h2>{category}</h2>
    {#each Object.entries(courses) as [key, value]}
        <CourseItem {value} {selectedCourses} {key}></CourseItem>
    {/each}
</div>

<style>
    #container {
        width: 25%;
        height: 98%;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 20px;
        background-color: rgba(255, 255, 255, 0.25);
        overflow: auto;
        box-shadow: 3px 3px 3px 0 rgba(0, 0, 0, 0.30);
    }

    h2 {
        text-align: center;
        height: 3rem;
        width: 100%;
        line-height: 3rem;
        background-color: rgba(255, 255, 255, 0.3);
        font-size: 2rem;
    }
</style>
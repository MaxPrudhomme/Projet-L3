<script>
    import Icon from "$lib/Icon.svelte";

    export let current;
    export let signupProcess;
    export let formData;
    export let steps;

    function checkAlerts() {
        let temp = [
            {text: "Account", alert: false},
            {text: "School", alert: false},
            {text: "Confirm"}
        ]

        if ($formData.firstName && $formData.lastName && $formData.email && $formData.phoneNumber && $formData.country && $formData.password) {
            temp[0]["alert"] = false;
        } else {
            temp[0]["alert"] = true;
        }

        if ($formData.selectedSchool) {
            temp[1]["alert"] = false;
        } else {
            temp[1]["alert"] = true;
        }

        steps.set(temp)
    }

    function updateCurrent(caller) {
        checkAlerts()
        if (caller) {
            if ($current > 0) {
                current.set($current -= 1);
            } else if ($current == 0) {
                signupProcess.set(false)
            }
        } else {
            if ($current < 2) {
                current.set($current += 1);
            }
        }
    }
</script>

<div id="container">
    <button class="buttonReset controls" on:click={() => updateCurrent(true)}>
        <Icon name={"arrow-left-circle-fill"} class={"s32x32 confirmBlueFilter"}></Icon>
    </button>

    <button class="buttonReset controls" on:click={() => updateCurrent(false)}>
        <Icon name={"arrow-right-circle-fill"} class={"s32x32 confirmBlueFilter"}></Icon>  
    </button>
</div>


<style>
    #container {
        display: flex;
        width: 80%;
        justify-content: space-between;
        margin-bottom: 1.5rem;
    }
</style>
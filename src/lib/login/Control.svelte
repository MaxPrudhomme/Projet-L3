<script>
    import Icon from "$lib/Icon.svelte";

    // Export variables that are used to manage the signup process and its form data.
    export let current;
    export let signupProcess;
    export let formData;
    export let steps;


    // Fonction pour vérifier les alertes de chaque étape du processus d'inscription
    // Function to check alerts for each step in the signup process
    function checkAlerts() {
        let temp = [
            {text: "Account", alert: false},
            {text: "School", alert: false},
            {text: "Confirm"}
        ]

        // Checks if all account information fields are filled; sets alert accordingly
        if ($formData.firstName && $formData.lastName && $formData.email && $formData.phoneNumber && $formData.country && $formData.password) {
            temp[0]["alert"] = false;
        } else {
            temp[0]["alert"] = true;
        }

        // Checks if the school selection is made; sets alert accordingly
        if ($formData.selectedSchool) {
            temp[1]["alert"] = false;
        } else {
            temp[1]["alert"] = true;
        }
 
        steps.set(temp)
    }

    // Fonction pour mettre à jour l'étape actuelle du processus d'inscription
    // Function to update the current step in the signup process
    function updateCurrent(caller) {
        checkAlerts()
        if (caller) {
            // Decrements the current step or exits the signup process if at the first step
            if ($current > 0) {
                current.set($current -= 1);
            } else if ($current == 0) {
                signupProcess.set(false)
            }
        } else {
            // Increments the current step if not at the last step
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
<script>
    import { Steps } from "svelte-steps";
    import Icon from "$lib/Icon.svelte";
    import Control from "./Control.svelte";
    import ActionButton from "$lib/content/ActionButton.svelte"
	import { writable } from "svelte/store";
    import { db, storage } from "$lib/firebase";
    import { doc, getDoc  } from "firebase/firestore";
    import { getStorage, ref, getDownloadURL } from 'firebase/storage';

    function handleSubmit() {
        console.log("SUBMIT")
    }

    const formData = writable({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        country: '',
        password: '',
        confirmPassword: '',
        selectedSchool: '',
        acceptTOS: false
    });


    const steps = [
        {text: "Account"},
        {text: "School"},
        {text: "Confirm"}
    ]
    
    export const current = writable(0)

    let schools = {}
    let schoolData = null
    let imageURL = ""

    async function fetchSchools() {
        try {
            const indexRef = doc(db, 'schools/index')
            const schoolData= (await getDoc(indexRef)).data()
            schools = schoolData;
        } catch(e) {
            console.log(e)
        }

    }

    async function fetchSchoolDetails(target) {
        if (target == "other") { return }
        try {
            const targetRef = doc(db, 'schools', target)
            const targetData = (await getDoc(targetRef)).data()
            schoolData = targetData
            
            const imageRef = ref(storage, `schoolContent/${target}.jpg`);
            imageURL = await(getDownloadURL(imageRef))

        } catch(e) {
            console.log(e)
        }
    }
    fetchSchools()
</script>

<div id="container" class="glass noise">
    <Icon name="person-vcard" class="s80x80"></Icon>

    <h1>Sign Up</h1>
    <!-- Account Section -->
    <form id="formContainer">
        {#if $current == 0}
            <fieldset id="nameContainer">
                <input type="text" placeholder="First Name" class="input input-top" bind:value={$formData.firstName}>
                <input type="text" placeholder="Last Name" class="input input-bot" bind:value={$formData.lastName}>
            </fieldset>
            
            <fieldset id="infoContainer">
                <input type="text" placeholder="Email Address" class="input input-top" bind:value={$formData.email}>
                <input type="text" placeholder="Phone Number" class="input" bind:value={$formData.phoneNumber}>
                <input type="text" placeholder="Country" class="input input-bot" bind:value={$formData.country}>
            </fieldset>
            
            <fieldset id="passwordContainer">
                <input type="password" placeholder="Enter your password" class="input input-top" bind:value={$formData.password}>
                <input type="password" placeholder="Confirm your password" class="input input-bot" bind:value={$formData.confirmPassword}>
            </fieldset>
        {/if}
        <!-- School Section -->
        {#if $current == 1} 
            <fieldset id="schoolContainer">
                <select id="schoolSelect" name="school" class="input input-solo" bind:value={$formData.selectedSchool} on:change={event => fetchSchoolDetails(event.target.value)}>
                    <option value="" disabled selected>Select a school...</option>
                    {#each Object.entries(schools) as [key, value]}
                        <option value={key}>{value}</option>
                    {/each}
                    <option value="other">My school is not supported</option>
                </select>
            </fieldset>
            {#if schoolData !== null}
            <!-- svelte-ignore a11y-img-redundant-alt -->
            <img id="schoolPicture" src={imageURL} alt="School Picture">
            <div id="schoolInfoContainer">
                <p><span>Address :</span> {schoolData.address.street}, {schoolData.address.city}, {schoolData.address.zipcode}, {schoolData.address.country}</p>
                <br>
                <p><span>Email :</span> {schoolData.email}</p>
                <br>
            </div>
            {/if}
        {/if}
        <!-- Confirm Section -->
        {#if $current == 2}
        <fieldset>
            <p id="confirmText">We've got what we need to setup the account ! <b>Ready to join ?</b></p>
            <label id="tos">
                <input type="checkbox" bind:checked={$formData.acceptTOS}>
                I have read and accept the Terms of Use
            </label>
            <ActionButton content={"Create my Account"} mode={"confirm"} onClickFunction={handleSubmit} disabled={$formData.acceptTOS ? false : true}></ActionButton>
        </fieldset>

        {/if}

    </form>
    
    <Control {current}></Control>
    <Steps current={$current} {steps} size="2.3rem" clickable={false} fontFamily="SFPro-Regular"></Steps>

</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 2.5rem;
    }

    h1 {
        text-decoration: underline;
        margin-top: 1.5rem;
    }

    #formContainer {
        height: 50%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-top: 2rem;
        margin-bottom: 1.5rem;
    }

    fieldset {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 auto;
        width: 100%;
        border: none;
    }

    select {
        cursor: pointer;
    }

    #schoolInfoContainer {
        width: 80%;
        font: 500;
        margin: auto;
    }

    span {
        font-weight: bold;
        font-size: 1.2rem;
    }

    #schoolPicture {
        width: 19rem;
        margin: auto;
        border: 2px solid white;
        border-radius: 15px;
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.30);
    }
    
    #tos {
        font-size: 1.2rem;
        width: 85%;
        margin-top: 5rem;
        margin-bottom: 5rem;
    }

    #confirmText {
        font-size: 1.4rem;
        width: 85%;
    }

</style>
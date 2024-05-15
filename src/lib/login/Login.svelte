<script>
    import { auth } from "$lib/firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";
    import { userToken, userUid } from "../../store";
    import { fly, fade } from "svelte/transition";
    import Icon from "$lib/Icon.svelte";

    export let signupProcess;

    let email = null;
    let password = null;
    let loginButton;

    function handleSubmit() {
        if (email && password ) {
            signInWithEmailAndPassword(auth, email, password).then((cred) => {
                userToken.set(cred)
                userUid.set(auth.currentUser.uid)
                loginButton.innerText = "Success"
            })
            .catch((error) => {
                console.log(error.code, error.message)
            })
        }
        email = null;
        password = null;
    }
    
    function triggerSignUp() {
        signupProcess.set(true)
    }
</script>

<div id="container" in:fade={{duration: 250, delay: 250}} out:fade={{duration: 250, delay: 0}}>
    <Icon name="fingerprint" class="s80x80"></Icon>
    <h1>Login</h1>
    <form on:submit|preventDefault={handleSubmit} style="display:flex; flex-direction:column;">
        <div id="formContainer">
            <input bind:value={email} class="input input-top" type="email" placeholder="Email">
            <input bind:value={password} class="input input-bot" type="password" placeholder="Password">
        </div>
        <button id="resetButton" class="buttonReset">Reset Password</button>

        <button id="loginButton" type="submit" class="buttonReset" bind:this={loginButton}>Login</button>
    </form>
    
    <h2>or</h2>

    <button id="signupButton" class="buttonReset" on:click={triggerSignUp}>Create an Account</button>
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 2.5rem;
        background-color: rgba(255, 255, 255, 0.3);
        transition: all 0.5s ease;
    }

    h1 {
        text-decoration: underline;
        margin-top: 1.5rem;
    }

    #formContainer {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 2rem;
    }

    #resetButton {
        margin-top: 15px;
        font-size: 18px;
        color: rgba(0, 0, 0, 0.5)
    }


    #loginButton {
        margin-top: 120px;
        margin-left: auto;
        margin-right: auto;
    }

    #signupButton {
        margin-top: 25px;
    }

    h2 {
        margin-top: 25px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.5)
    }

    #loginButton, #signupButton {
        width: 230px;
        height: 50px;
        border-radius: 30px;
        box-shadow: 4px 4px 4px 0 rgba(0, 0, 0, 0.10);
        background-color: rgba(255, 255, 255, 0.70);
        font-size: 18px;
        color: rgba(0, 0, 0, 0.5)
    }

    #loginButton:hover {
        background-color: rgba(255, 255, 255, 0.85);
    }

</style>
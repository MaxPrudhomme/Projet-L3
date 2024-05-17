<script>
  import { editMode, widgets, interactionActive, userUid, currentView, widgetEdit } from "../../store";
  import { db } from "$lib/firebase";
  import { doc, updateDoc } from "firebase/firestore";

  let widgetsBackup = [];

  function toggleEdit() {
    editMode.set(true);
    widgetsBackup = JSON.parse(JSON.stringify($widgets));
  }

  async function saveChanges() {
    editMode.set(false); 
    if ($currentView === "dashboard") {
      const targetRef = doc(db, 'users', $userUid)
      await updateDoc(targetRef, {
        dashboard: $widgets
      })
    } else {
      const targetRef = doc(db, 'users', $userUid, 'userCourses', $currentView)
      await updateDoc(targetRef, {
        widgets: $widgets
      })
    }
  }

  function cancelChanges() {
    editMode.set(false);
    widgets.set(widgetsBackup);
}

  function browseWidgets() {
    interactionActive.set(true)
    widgetEdit.set(true)
  }
</script>

<div id="container">
  <!-- Toggle Edit Button -->
  {#if !$editMode}
  <button on:click={toggleEdit}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="0 0 16 16">
      <path d="M4 4v2H2V4zm1 7V9a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V4a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m5 5V9a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1m0-5V4a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1M9 4v2H7V4zm5 0h-2v2h2zM4 9v2H2V9zm5 0v2H7V9zm5 0v2h-2V9zm-3-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1z"/>
    </svg>
  </button>
  {:else}
      <!-- Save changes Button -->
      <button on:click={saveChanges} id="saveChangesButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="-3 -2 22 22">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
        </svg>
      </button>
  
      <!-- Cancel changes Button -->
      <button on:click={cancelChanges} id="cancelChangesButton">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="-3 -2 22 22">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
      </button>
  
      <!-- Browse Widgets -->
      <button on:click={browseWidgets}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="white" viewBox="-3 -2 22 22">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </button>
  {/if} 

</div>

<style>
  #container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 42px;
  }

  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: all 0.5s ease;
    opacity: 0.6;
    margin: 5px;
    height: 32px;
  }

  button:hover {
    opacity: 0.9;
  }
</style>

import { v4 } from "uuid";

// Function to query database for events between two dates and specific IDs
async function querydb(startdate, enddate, IDs) {
  try {
    const url = await import.meta.env.VITE_URL + 'select.php';  // Assembles URL from environment variable
    const args = new FormData();
    args.append('startdate', startdate.getTime());  // Convert start date to time format
    args.append('enddate', enddate.getTime());  // Convert end date to time format
    IDs.forEach(e => {
      args.append('IDs[]', e);  // Append each ID to the form data
    })
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url, options);  // Make a POST request to the server
    const data = await response.json();  // Parse JSON response
    data.forEach(e => {
      e.startDate = new Date(parseInt(e.startDate));  // Convert startDate string to Date object
      e.endDate = new Date(parseInt(e.endDate));  // Convert endDate string to Date object
    })
    return data;  // Return the modified data array
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}

// Function to insert a list of events into the database
async function insertdb(listevent) {
  try {
    const url = await import.meta.env.VITE_URL + 'insert.php';  // URL to the insert script
    const args = new FormData();
    listevent.forEach(e => {
      args.append('IDs[]', v4());  // Generate a new UUID for each event
      args.append('startDates[]', e.startDate.getTime());
      args.append('endDates[]', e.endDate.getTime());
      args.append('summarys[]', e.summary);
      args.append('descriptions[]', e.description);
      args.append('locations[]', e.location);
      args.append('IDscourse[]', e.IDcourse);
    })
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url, options);  // Send the data to the server via POST
    const data = await response.text();  // Get the response text
    return data;  // Return response
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}

// Function to delete an event by ID from the database
async function deletedb(ID) {
  try {
    const url = await import.meta.env.VITE_URL + 'delete.php';  // URL to the delete script
    const args = new FormData();
    args.append('ID', ID);  // Append the ID to delete
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url, options);  // Send the delete request to the server
    const data = await response.text();  // Get the response text
    return data;  // Return response
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}

// Function to update an event in the database
async function updatedb(event) {
  try {
    const url = await import.meta.env.VITE_URL + 'update.php';  // URL to the update script
    const args = new FormData();
    args.append('ID', event.ID);  // Append event ID
    args.append('startDate', event.startDate.getTime());  // Append event start date
    args.append('endDate', event.endDate.getTime());  // Append event end date
    args.append('summary', event.summary);  // Append event summary
    args.append('description', event.description);  // Append event description
    args.append('location', event.location);  // Append event location
    args.append('IDcourse', event.IDcourse);  // Append event course ID
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url, options);  // Send the update request to the server
    const data = await response.text();  // Get the response text
    return data;  // Return response
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}

export { querydb, insertdb, deletedb, updatedb };  // Export functions for use elsewhere

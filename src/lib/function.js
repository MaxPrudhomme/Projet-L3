import { v4 } from "uuid";

async function querydb(startdate, enddate, IDs) {
  try {
    const url = await import.meta.env.VITE_URL + 'select.php';
    const args = new FormData();
    args.append('startdate', startdate.getTime());
    args.append('enddate', enddate.getTime());
    IDs.forEach(e => {
      args.append('IDs[]',e);
    })
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url,options);
    const data = await response.json();
    data.forEach(e => {
      e.startDate = new Date(parseInt(e.startDate));
      e.endDate = new Date(parseInt(e.endDate));
    })
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
/**-------------------------insert-------------------------
import { querydb } from '../function';
import { onMount } from 'svelte';
onMount(async () => {
  try {
    const startdate = new Date('2024-05-03 00:00:00'); //max start date
    const enddate = new Date('2024-05-04 00:00:00'); //max end date
    const IDs = ['aaaaaaaaaaaaaaaaaaaa','4PSFgCCPpzaOdKChhgyG'];  //list of ID's course in string
    const data = await querydb(startdate, enddate, IDs);
    //you can use data here
    console.log("Résultat de la fonction PHP :", data);
  } catch (error) {
    //handle errors here
    console.log(error);
  }
});
*/

async function insertdb(listevent) {
  try {
    const url = await import.meta.env.VITE_URL + 'insert.php';
    const args = new FormData();
    listevent.forEach(e => {
      args.append('IDs[]',v4());
      args.append('startDates[]',e.startDate.getTime());
      args.append('endDates[]',e.endDate.getTime());
      args.append('summarys[]',e.summary);
      args.append('descriptions[]',e.description);
      args.append('locations[]',e.location);
      args.append('IDscourse[]',e.IDcourse);
    })
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url,options);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
/**-------------------------insert-------------------------
import { insertdb } from '../function';
import { onMount } from 'svelte';
onMount(async () => {
  try {
    const param1 = [{ //list of map for event
        startDate: new Date('2024-05-03 12:00:00'),
        endDate: new Date('2024-05-03 13:00:00'),
        summary: "test",
        description: "",
        location: "un endroit",
        IDcourse: "4PSFgCCPpzaOdKChhgyG"
    },{
        startDate: new Date('2024-05-03 13:00:00'),
        endDate: new Date('2024-05-03 14:00:00'),
        summary: "testbis",
        description: "",
        location: "un endroit",
        IDcourse: "4PSFgCCPpzaOdKChhgyG"
    }];
    const data = await insertdb(param1);
    //you can use data here
    console.log("Résultat de la fonction PHP :", data);
  } catch (error) {
    //handle errors here
    console.log(error);
  }
});
*/
async function deletedb(ID) {
  try {
    const url = await import.meta.env.VITE_URL + 'delete.php';
    const args = new FormData();
    args.append('ID',ID);
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url,options);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
/**-------------------------insert-------------------------
import { deletedb } from '../function';
import { onMount } from 'svelte';
onMount(async () => {
  try {
    const iD = '1ff1f260-cbbc-4b04-a769-a75e6bac80dd' //exemple of ID
    const data = await deletedb(iD);
    //you can use data here
    console.log("Résultat de la fonction PHP :", data);
  } catch (error) {
    //handle errors here
    console.log(error);
  }
});
*/

async function updatedb(event) {
  try {
    const url = await import.meta.env.VITE_URL + 'update.php';
    const args = new FormData();
    args.append('ID',event.ID);
    args.append('startDate',event.startDate.getTime());
    args.append('endDate',event.endDate.getTime());
    args.append('summary',event.summary);
    args.append('description',event.description);
    args.append('location',event.location);
    args.append('IDcourse',event.IDcourse);
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url,options);
    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
/**-------------------------insert-------------------------
import { updatedb } from '../function';
import { onMount } from 'svelte';
onMount(async () => {
  try {
    const event = {
        ID: '7cd5bee3-0e4b-4e6b-8f5e-63c516cda06a',
        startDate: new Date('2024-05-03 12:00:00'),
        endDate: new Date('2024-05-03 13:00:00'),
        summary: "testmodif",
        description: "",
        location: "un endroit",
        IDcourse: "4PSFgCCPpzaOdKChhgyG"
    };
    const data = await updatedb(event);
    //you can use data here
    console.log("Résultat de la fonction PHP :", data);
  } catch (error) {
    //handle errors here
    console.log(error);
  }
});
*/
export {querydb,insertdb,deletedb,updatedb};
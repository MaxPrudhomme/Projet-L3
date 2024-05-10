async function querydb(param1, param2, param3) {
  try {
    const current1 = param1.toISOString();
    const current2 = param2.toISOString();
    var current3 = "(";
    for (let i = 0; i < param3.length; i++) {
      current3+= "'" + param3[i] + "'";
      if(i+1 != param3.length){current3+= ",";}
    }
    current3+=")";
    const url = await import.meta.env.VITE_URL + 'select.php';
    const args = new FormData();
    args.append('arg1', current1);
    args.append('arg2', current2);
    args.append('arg3', current3);
    const options = {
      method: 'POST',
      body: args
    };
    const response = await fetch(url,options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
/**-------------------------insert-------------------------
import { querydb } from '../functionics';
import { onMount } from 'svelte';
onMount(async () => {
  try {
    const param1 = new Date('2024-05-03 00:00:00'); //max start date
    const param2 = new Date('2024-05-04 00:00:00'); //max end date
    const param3 = ['aaaaaaaaaaaaaaaaaaaa','test2'];  //list of ID's course in string
    const data = await querydb(param1, param2, param3);
    // Vous pouvez utiliser les données ici si nécessaire
    console.log("Résultat de la fonction PHP :", data);
  } catch (error) {
      console.log(error)
    // Gérer les erreurs ici si nécessaire
  }
});
*/

export {querydb};
async function interrogerBaseDeDonnees(param1, param2) {
  try {
    const response = await fetch(import.meta.env.VITE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'interrogerBaseDeDonnees', // Nom de la fonction à appeler
        param1: param1,
        param2: param2
      })
    });
    
    if (!response.ok) {
      throw new Error('La requête a échoué');
    }

    const data = await response.json();

    // Renvoyer les données
    return data;
  } catch (error) {
    console.error("Erreur lors de l'interrogation de la base de données :", error);
    throw error;
  }
}
export {interrogerBaseDeDonnees};
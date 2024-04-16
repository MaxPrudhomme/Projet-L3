import { storage } from './firebase';
import ical from 'ical.js';
import { getStorage, ref, getBlob , getMetadata } from 'firebase/storage';

function test2(){
  const Ref = ref(storage, 'icscalendar/4PSFgCCPpzaOdKChhgyG.ics');
  console.log(Ref)
}
// Fonction pour récupérer le contenu d'un fichier .ics à partir de son chemin dans Firebase Storage
async function fetchICSContent(icsPath) {
  try {
    const icsFileRef = ref(storage, icsPath);
    const metadata = await getMetadata(icsFileRef);
    if (!metadata.contentType.startsWith('text')) {
        throw new Error('Le fichier n\'est pas un fichier texte');
    }
    const blob = await getBlob(icsFileRef);
    const reader = new FileReader();
    reader.readAsText(blob);
    return new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
    });
  } catch (error) {
      console.error('Erreur lors de la récupération du contenu du fichier .ics :', error);
      return null;
  }
}

// Fonction pour analyser le contenu d'un fichier .ics en utilisant ical.js
function parseICSContent(icsContent) {
  try {
      const parsedICS = ical.parseICS(icsContent);
      const events = Object.values(parsedICS);
      return events;
  } catch (error) {
      console.error('Erreur lors de l\'analyse du contenu du fichier .ics :', error);
      return [];
  }
}

function test() {
// Exemple d'utilisation :
const icsPath = 'gs://projet-l3-88394.appspot.com/icscalendar/4PSFgCCPpzaOdKChhgyG.ics';

fetchICSContent(icsPath)
.then((icsContent) => {
  console.log('Contenu du fichier .ics :', icsContent);
  const events = parseICSContent(icsContent);
  console.log('Événements du fichier .ics :', events);
  // Traitez les événements récupérés ici
})
.catch((error) => {
  console.error('Erreur lors de la récupération du fichier .ics :', error);
});
}

export { test }

//-----------------------------------------------------------------------------//
/*
function generateEmptyICS() {
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Example Corp.//CalDAV Client//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
END:VCALENDAR
`;

  return icsContent;
}

async function uploadICSToStorage(icsContent, filePath) {
  try {
    const storage = getStorage();
    const storageRef = ref(storage, filePath);

    await uploadString(storageRef, icsContent, 'data:text/calendar');
    
    console.log('Fichier ICS ajouté à Firebase Storage avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'ajout du fichier ICS à Firebase Storage :', error);
  }
}

function addICSFile(){
  const emptyICSContent = generateEmptyICS();
  uploadICSToStorage(emptyICSContent,'mon_calendrier.ics');
}*/
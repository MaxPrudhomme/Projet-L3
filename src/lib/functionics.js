import { storage } from './firebase';
import ical from 'ical.js';
import { getStorage, ref, uploadString } from 'firebase/storage';

async function fetchICSFiles() {
	try {
		const storageRef = await storage.ref();
		const files = await storageRef.listAll();
		const icsFiles = [];

		for (const file of files.items) {
			if (file.name.endsWith('.ics')) {
				const url = await file.getDownloadURL();
				icsFiles.push({ name: file.name, url: url });
			}
		}

		return icsFiles;
	} catch (error) {
		console.error('Error fetching ICS files from Firebase Storage :', error);
		return [];
	}
}

async function parseICSFile(fileURL) {
	try {
		const response = await fetch(fileURL);
		const text = await response.text();
		const jcalData = ical.parse(text);
		const comp = new ical.Component(jcalData);
		const vevents = comp.getAllProperties('vevent');

		const events = vevents.map((vevent) => {
			return {
				summary: vevent.getFirstPropertyValue('summary'),
				startDate: vevent.getFirstPropertyValue('dtstart'),
				endDate: vevent.getFirstPropertyValue('dtend')
			};
		});

		return events;
	} catch (error) {
		console.error('Error analysing ICS files :', error);
		return [];
	}
}

/*
<!-- App.svelte -->
<script>
  import { onMount } from 'svelte';
  import { fetchICSFiles } from './icsFetcher.js';
  import { parseICSFile } from './icsParser.js';

  let events = [];

  onMount(async () => {
    const icsFiles = await fetchICSFiles();
    for (const file of icsFiles) {
      const fileEvents = await parseICSFile(file.url);
      events = events.concat(fileEvents);
    }
  });
</script>

{#if events.length > 0}
  <ul>
    {#each events as event}
      <li>{event.summary} - {event.startDate} à {event.endDate}</li>
    {/each}
  </ul>
{:else}
  <p>Aucun événement trouvé.</p>
{/if}
import { getStorage, ref } from 'firebase/storage';
END:VCALENDAR
`;

  return icsContent;
}*/

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
		console.error("Erreur lors de l'ajout du fichier ICS à Firebase Storage :", error);
	}
}

function addICSFile() {
	const emptyICSContent = generateEmptyICS();
	uploadICSToStorage(emptyICSContent, 'mon_calendrier.ics');
}

export { fetchICSFiles, parseICSFile, addICSFile };

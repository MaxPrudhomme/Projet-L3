import { writable } from 'svelte/store';

export const editMode = writable(false);
export const widgetEdit = writable(false);
export const courseEdit = writable(false);

export const interactionActive = writable(false);

export const widgets = writable([]);

export const matrixRepresentation = writable([
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
]);

export const userToken = writable(null); // Result from connection
export const userUid = writable(null); // Extracted from userToken
export const user = writable(null) // Extracted from userToken

export const currentView = writable("dashboard") // Represents the dashboard or the subjects
export const currentContent =  writable([]) // Content taken from the user file
export const currentTab = writable("widgets") // Represents the widgets, files, comms tab

export const overrideAnimations = writable(false)
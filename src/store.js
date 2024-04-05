import { writable } from 'svelte/store';

export const editMode = writable(false);

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

export const currentView = writable("dashboard")
export const currentContent =  writable([])
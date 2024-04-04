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

export const userToken = writable(null);
export const userUid = writable(null);
export const user = writable(null)

export const currentView = writable("dashboard")
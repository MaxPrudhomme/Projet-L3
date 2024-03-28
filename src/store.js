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

//{id: 1, x: 0, y: 0, w: 1, h: 1, content: ["schedule", "s"]} Example grid

import { db } from '$lib/firebase';
import { writable } from 'svelte/store';

export const editMode = writable(false);

export const widgets = writable([{ x: 0, y: 0, w: 2, h: 4 }]);

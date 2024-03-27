import { writable } from "svelte/store";

export const editMode = writable(false)

export const widgets = writable([
    { x: 1, y: 0, w: 1, h: 1 },
    { x: 0, y: 1, w: 2, h: 1 },
    { x: 0, y: 2, w: 2, h: 2 },
    { x: 2, y: 2, w: 1, h: 2 },
    { x: 5, y: 0, w: 2, h: 4 },
    { x: 3, y: 0, w: 2, h: 2 },
]);

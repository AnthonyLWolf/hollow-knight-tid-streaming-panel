// Counter logic

import { state, saveState } from "../data/state.js";
import { renderAttempts } from "../main.js";

// Increment function
export function incrementAttempts() {
    state.attempts += 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Decrease function just in case
export function decreaseAttempts() {
    state.attempts -= 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Reset function just in case
export function resetAttempts() {
    state.attempts = 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}
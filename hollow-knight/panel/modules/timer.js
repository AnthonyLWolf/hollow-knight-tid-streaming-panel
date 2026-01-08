// Timer logic

import { state, saveState, loadState } from "../data/state.js";
import { renderTimer } from "../main.js";

// Timer intervals for calculations
export let renderInterval = null;
export let timerSaveInterval = null;

// Formats time calculating by milliseconds
export function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    // Pads digits by a minimum of two
    const pad = (n) => String(n).padStart(2, "0");

    // Formats final string
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

// Starts the timer
export function startTimer() {
    if (state.timerRunning) {
        return;
    }

    // Grabs timestamp and initiates running boolean
    state.startTimestamp = Date.now();
    state.timerRunning = true;

    // Interval check, renders timer every 10ms for fluidity
    if (!renderInterval) {
        renderInterval = setInterval(renderTimer, 10);
    }
    if (!timerSaveInterval) {
        timerSaveInterval = setInterval(saveState, 2000);
    }

    // Saves to local storage for later
    saveState();
    console.log("Timer started");
}

// Stops timer and clears all intervals
export function stopTimer() {
    if (!state.timerRunning) {
        return;
    }

    state.elapsedBefore += Date.now() - state.startTimestamp;
    state.startTimestamp = null;
    state.timerRunning = false;

    if (renderInterval) {
        clearInterval(renderInterval);
        renderInterval = null;
    }
    if (timerSaveInterval) {
        clearInterval(timerSaveInterval);
        timerSaveInterval = null;
    }

    renderTimer();
    saveState();
    console.log("Timer stopped");

}

// Resets timer to 00:00:00.00
export function resetTimer() {
    state.elapsedBefore = 0;
    state.startTimestamp = null;
    state.timerRunning = false;

    if (renderInterval) {
        clearInterval(renderInterval);
        clearInterval(timerSaveInterval);
        renderInterval = null;
        timerSaveInterval = null;
    }

    renderTimer();
    saveState();
    console.log("Timer reset");
}

// Manual setting for debugging and behaviour fixes
export function setTimer(seconds) {
    state.elapsedBefore += seconds * 1000;
    renderTimer();
    saveState();
    console.log("Timer set");
}
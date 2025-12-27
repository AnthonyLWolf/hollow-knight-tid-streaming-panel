// Timer logic

import { state, saveState, loadState } from "../data/state.js";
import { renderTimer } from "../main.js";

let renderInterval = null;
let timerSaveInterval = null;

export function formatTime(ms) {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

export function startTimer() {
    if (state.timerRunning) {
        return;
    }

    state.startTimestamp = Date.now();
    state.timerRunning = true;

    if (!renderInterval) {
        renderInterval = setInterval(renderTimer, 10);
        timerSaveInterval = setInterval(saveState, 2000);
    }

    saveState();
    console.log("Timer started");
}

export function stopTimer() {
    if (!state.timerRunning) {
        return;
    }

    state.elapsedBefore += Date.now() - state.startTimestamp;
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
    console.log("Timer stopped");

}

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
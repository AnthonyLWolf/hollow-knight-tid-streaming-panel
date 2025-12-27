// main.js (v0 foundation)

import { connectStreamerBotHotkeys } from "./modules/hotkeys-streamerbot.js"
import { state, saveState, loadState } from "./data/state.js";
import { togglePanelVisibility } from "./modules/panel.js";
import { formatTime, startTimer, stopTimer, setTimer, resetTimer, renderInterval, timerSaveInterval } from "./modules/timer.js";

const ui = {
    attemptsValue: document.getElementById("attemptsValue"),
    timerValue: document.getElementById("timerValue"),
    bossGrid: document.getElementById("bossGrid"),
};

// Render functions (tiny on purpose)
function renderAttempts() {
    ui.attemptsValue.textContent = String(state.attempts);
}

export function renderTimer() {
    let elapsed = state.elapsedBefore;

    if (state.timerRunning && state.startTimestamp) {
        elapsed += Date.now() - state.startTimestamp;
    }

    ui.timerValue.textContent = formatTime(elapsed);
}

// Increment function
function incrementAttempts() {
    state.attempts += 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Decrease function just in case
function decreaseAttempts() {
    state.attempts -= 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Reset function just in case
function resetAttempts() {
    state.attempts = 1;
    saveState();
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Resets entire layout
function resetPanel() {
    resetAttempts();
    resetTimer();
    // TODO: resetBosses();
}

// Boot
function init() {
    // HARD RESET SAFETY
    if (window.__PANEL_BOOTED__) {
        console.warn("Panel already booted - aborting duplicate init");
        return;
    }


    if (!ui.attemptsValue || !ui.timerValue || !ui.bossGrid) {
        console.error("UI hooks missing. Check your IDs in HTML.");
        return;
    }

    loadState();

    // Browser source reload = timer must stop
    state.timerRunning = false;
    state.startTimestamp = null;

    // Clear any stray intervals
    if (renderInterval) {
        clearInterval(renderInterval);
        renderInterval = null;
    }
    if (timerSaveInterval) {
        clearInterval(timerSaveInterval);
        timerSaveInterval = null;
    }

    renderAttempts();
    renderTimer();

    if (state.timerRunning) {
        state.startTimestamp = Date.now();

        renderInterval = setInterval(renderTimer, 10);
        timerSaveInterval = setInterval(saveState, 2000);
    }

    // Exposing controls
    window.panel = {
        state,
        incrementAttempts,
        decreaseAttempts,
        resetAttempts,

        startTimer,
        stopTimer,
        resetTimer,
        setTimer,

        togglePanelVisibility,
        resetPanel,
    };

    // Emergency kill switch
    window.panel.hardReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    };


    connectStreamerBotHotkeys({ port: 8080 });

    console.log("Panel loaded. Try panel.[command]()");
}

init();
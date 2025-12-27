// main.js (v0 foundation)

import { connectStreamerBotHotkeys } from "./modules/hotkeys-streamerbot.js"
import { state, saveState, loadState } from "./data/state.js";
import { formatTime, startTimer, stopTimer, setTimer, resetTimer } from "./modules/timer.js";

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

function resetPanel() {
    resetAttempts();
    resetTimer();
}

// Boot
function init() {
    if (!ui.attemptsValue || !ui.timerValue || !ui.bossGrid) {
        console.error("UI hooks missing. Check your IDs in HTML.");
        return;
    }

    loadState();
    renderAttempts();
    renderTimer();

    if (state.timerRunning) {
        state.startTimestamp = Date.now();

        renderInterval = setInterval(renderTimer, 10);
        timerSaveInterval = setInterval(saveState, 2000);
    }

    window.panel = {
        state,
        incrementAttempts,
        decreaseAttempts,
        resetAttempts,

        startTimer,
        stopTimer,
        resetTimer,
        setTimer,

        resetPanel,
    };

    connectStreamerBotHotkeys({ port: 8080 });

    console.log("Panel loaded. Try panel.[command]()");
}

init();
// main.js (v1)

import { connectStreamerBotHotkeys } from "./modules/hotkeys-streamerbot.js"
import { togglePanelVisibility, animatePanelReset } from "./modules/panel.js";
import { state, saveState, loadState } from "./data/state.js";
import { incrementAttempts, decreaseAttempts, resetAttempts } from "./modules/attempts.js";
import { formatTime, startTimer, stopTimer, setTimer, resetTimer, renderInterval, timerSaveInterval } from "./modules/timer.js";
import { renderBossGrid, selectNextBoss, selectPreviousBoss, selectBossDown, selectBossUp, toggleBoss, resetBosses } from "./modules/bosses.js";
import { HK_BOSSES } from "./data/bosses-data.js";

const ui = {
    attemptsValue: document.getElementById("attemptsValue"),
    timerValue: document.getElementById("timerValue"),
    bossGrid: document.getElementById("bossGrid"),
};

const BOSS_COLUMNS = 4;

// Render functions
export function renderAttempts() {
    ui.attemptsValue.textContent = String(state.attempts);
}

export function renderTimer() {
    let elapsed = state.elapsedBefore;

    if (state.timerRunning && state.startTimestamp) {
        elapsed += Date.now() - state.startTimestamp;
    }

    ui.timerValue.textContent = formatTime(elapsed);
}

// Resets entire layout
function resetPanel() {
    resetAttempts();
    resetTimer();
    resetBosses(state, ui.bossGrid, saveState);

    animatePanelReset();
}

//// Boss selection wrappers
// Moves selection
function moveBossSelectionRight() {
    console.log("Selecting next boss");
    selectNextBoss(state, HK_BOSSES.length);
    renderBossGrid(ui.bossGrid, state, saveState);
}

function moveBossSelectionLeft() {
  selectPreviousBoss(state);
  renderBossGrid(ui.bossGrid, state, saveState);
}

function moveBossSelectionDown() {
  selectBossDown(state, BOSS_COLUMNS, HK_BOSSES.length);
  renderBossGrid(ui.bossGrid, state, saveState);
}

function moveBossSelectionUp() {
  selectBossUp(state, BOSS_COLUMNS);
  renderBossGrid(ui.bossGrid, state, saveState);
}

// Toggles boss
function toggleSelectedBoss() {
    const selected = HK_BOSSES[state.selectedBossIndex];
    if (!selected) {
        return;
    }

    toggleBoss(selected.id, state, ui.bossGrid, saveState);
}

//// Boot
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

    // Loads the latest state in local storage
    loadState();

    // Renders boss grid
    renderBossGrid(ui.bossGrid, state, saveState);

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

        bossRight: moveBossSelectionRight,
        bossLeft: moveBossSelectionLeft,
        bossUp: moveBossSelectionUp,
        bossDown: moveBossSelectionDown,
        selectBoss: toggleSelectedBoss,
    };

    // Control to reset bosses grid
    window.panel.resetBosses = () => {
        resetBosses(state, ui.bossGrid, saveState);
    }

    // Emergency kill switch
    window.panel.hardReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
    };


    connectStreamerBotHotkeys({ port: 8080 });

    console.log("Panel loaded. Try panel.[command]()");
}

init();
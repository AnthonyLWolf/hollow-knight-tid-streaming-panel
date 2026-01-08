// Panel logic

import { state } from "../data/state.js";
import { formatTime } from "./timer.js";

// Toggles visibility to handle OBS connection logic
export function togglePanelVisibility() {
    document.querySelector(".panel-container-sidebar")?.classList.toggle("overlay-hidden");
}

// Subtle animation on Panel Reset
export function animatePanelReset() {
    const panel = document.querySelector(".panel-container-sidebar");
    if (!panel) return;

    panel.classList.remove("is-resetting"); // safety
    void panel.offsetWidth;                 // force reflow
    panel.classList.add("is-resetting");
}

// Renders the debug overlay on request
export function renderDebugOverlay() {
    const el = document.getElementById("debugOverlay");
    if (!el) {
        return;
    }

    // Checks overlay condition
    if (!state.debugVisible) {
        el.classList.add("hidden");
        return;
    }

    el.classList.remove("hidden");

    // Renders inner text with key stats
    el.innerText = `
    DEBUG
    Attempts: ${state.attempts}
    Timer running: ${state.timerRunning}
    Elapsed: ${formatTime(
        state.elapsedBefore +
        (state.timerRunning && state.startTimestamp
            ? Date.now() - state.startTimestamp
            : 0)
    )}
    Selected boss: ${state.selectedBossIndex}
    Bosses defeated: ${Object.keys(state.bossesDefeated).length}
    `.trim();
}

export function toggleDebugOverlay() {
    state.debugVisible = !state.debugVisible;
    renderDebugOverlay();
}
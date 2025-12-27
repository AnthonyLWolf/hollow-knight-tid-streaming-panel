// State logic

// Storage key for local storage state
export const STORAGE_KEY = "hk_panel_state_v1";

// Main state class
export const state = {
    attempts: 1,
    startTimestamp: 0,
    elapsedBefore: 0,
    timerRunning: false,
    selectedBossIndex: 0,
    bossesDefeated: {}, // { [bossID]: true }, checks if boss is present and defeated
}

// Saves current state to memory
export function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.warn("saveState failed:", err)
    }
    
    console.log("State saved");
}

// Loads latest state from local storage
export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return; // Nothing saved yet
        }

        const parsed = JSON.parse(raw);

        // Merge only overwrite keys we recognise
        if (typeof parsed.attempts === "number") {
            state.attempts = parsed.attempts;
        }
        if (typeof parsed.elapsedBefore === "number") {
            state.elapsedBefore = parsed.elapsedBefore;
        }
        if (typeof parsed.timerRunning === "boolean") {
            state.timerRunning = parsed.timerRunning;
        }
        if (Array.isArray(parsed.bosses)) {
            state.bosses = parsed.bosses;
        }
        if (typeof parsed.selectedBossIndex === "number") {
            state.selectedBossIndex = parsed.selectedBossIndex;
        }
        if (parsed.bossesDefeated && typeof parsed.bossesDefeated === "object") {
            state.bossesDefeated = parsed.bossesDefeated;
        }
    } catch (err) {
        console.warn("loadState failed (bad JSON or blocked storage):", err)
    }
}
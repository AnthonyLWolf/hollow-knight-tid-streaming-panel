// Bosses grid logic

// Imports bosses data
import { HK_BOSSES } from "../data/bosses-data.js";
import { renderDebugOverlay } from "./panel.js";

// Renders boss grid based on CSS rules
export function renderBossGrid(container, state, saveState) {
    container.innerHTML = "";

    // For each boss, creates a tile with corresponding image
    [...HK_BOSSES].reverse().forEach((boss, index) => {
        const tile = document.createElement("div");
        tile.className = "boss-tile";

        // Observes defeat rules if present
        if (state.bossesDefeated[boss.id]) {
            tile.classList.add("is-defeated");
        }

        const visualIndex = HK_BOSSES.length - 1 - index;

        if (visualIndex === state.selectedBossIndex) {
            tile.classList.add("is-selected");
        }

        // Sources boss image
        const img = document.createElement("img");
        img.src = boss.img;
        img.alt = boss.name;

        // Creates tile
        tile.appendChild(img);

        // Enables click toggle for debugging
        tile.addEventListener("click", () => {
            toggleBoss(boss.id, state, container, saveState);
        });

        container.appendChild(tile);
    });

    renderDebugOverlay(); // Refreshes debug menu
}

// Selection functions based on grid index
export function selectNextBoss(state, bossCount) {
    state.selectedBossIndex = Math.min(
        state.selectedBossIndex + 1,
        bossCount - 1
    )
}

export function selectPreviousBoss(state, bossCount) {
    state.selectedBossIndex = Math.max(
        state.selectedBossIndex - 1,
        0
    )
}

export function selectBossDown(state, columns, bossCount) {
    const next = state.selectedBossIndex + columns;
    if (next < bossCount) {
        state.selectedBossIndex = next;
    }
}

export function selectBossUp(state, columns) {
    const next = state.selectedBossIndex - columns;
    if (next >= 0) {
        state.selectedBossIndex = next;
    }
}

// Toggles boss defeat state
export function toggleBoss(bossId, state, container, saveState) {
    if (state.bossesDefeated[bossId]) {
        delete state.bossesDefeated[bossId];
    } else {
        state.bossesDefeated[bossId] = true;
    }

    saveState();
    renderBossGrid(container, state, saveState)
}

// Allows reset of bosses grid
export function resetBosses(state, container, saveState) {
    state.bossesDefeated = {};
    saveState();
    renderBossGrid(container, state, saveState)
}
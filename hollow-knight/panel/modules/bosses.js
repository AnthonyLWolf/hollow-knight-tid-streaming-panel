// Bosses grid logic

import { HK_BOSSES } from "../data/bosses-data.js";

export function renderBossGrid(container, state, saveState) {
    container.innerHTML = "";

    HK_BOSSES.forEach((boss, index) => {
        const tile = document.createElement("div");
        tile.className = "boss-tile";

        if (state.bossesDefeated[boss.id]) {
            tile.classList.add("is-defeated");
        }

        if (index === state.selectedBossIndex) {
            tile.classList.add("is-selected");
        }

        const img = document.createElement("img");
        img.src = boss.img;
        img.alt = boss.name;

        tile.appendChild(img);

        tile.addEventListener("click", () => {
            toggleBoss(boss.id, state, container, saveState);
        });

        container.appendChild(tile);
    });
}

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

export function toggleBoss(bossId, state, container, saveState) {
    if (state.bossesDefeated[bossId]) {
        delete state.bossesDefeated[bossId];
    } else {
        state.bossesDefeated[bossId] = true;
    }

    saveState();
    renderBossGrid(container, state, saveState)
}

export function resetBosses(state, container, saveState) {
    state.bossesDefeated = {};
    saveState();
    renderBossGrid(container, state, saveState)
}
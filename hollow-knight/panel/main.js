// main.js (v0 foundation)

const ui = {
    attemptsValue: document.getElementById("attemptsValue"),
    timerValue: document.getElementById("timerValue"),
    bossGrid: document.getElementById("bossGrid"),
};

const state = {
    attempts: 1,
    timerSeconds: 0,
    timerRunning: false,
    bosses: [], // tomorrow
}

// Render functions (tiny on purpose)
function renderAttempts() {
    ui.attemptsValue.textContent = String(state.attempts);
}

function renderTimer() {
    // TODO: Format HH:MM:SS
    ui.timerValue.textContent = "00:00:00";
}

// Increments function
function incrementAttempts() {
    state.attempts += 1;
    renderAttempts();
    console.log(`Attempts: ${state.attempts}`);
}

// Boot
function init() {
    if (!ui.attemptsValue || !ui.timerValue || !ui.bossGrid) {
        console.error("UI hooks missing. Check your IDs in HTML.");
        return;
    }

    renderAttempts();
    renderTimer();

    window.panel = {
        state,
        incrementAttempts,
    };

    console.log("Panel loaded. Try: panel.incrementAttempts()");
}

init();
// Streamerbot Hotkeys connection, I have no idea what this does but it works

let sbSocket = null; // Module=level guard

export function connectStreamerBotHotkeys({ port = 8080 } = {}) {
    // Connection guard
    if (sbSocket && sbSocket.readyState === WebSocket.OPEN) {
        console.warn("[SB] WebSocket already connected");
        return sbSocket;
    }

    // Establishes connection
    sbSocket = new WebSocket(`ws://127.0.0.1:${port}`);

    sbSocket.addEventListener("open", () => {
    console.log("[SB] connected");

    // Subscribe to action events so we get action hotkey results
    sbSocket.send(JSON.stringify({
      request: "Subscribe",
      id: "hk-sub-1",
      events: {
        raw: ["ActionCompleted"]
      }
    }));
  });

  // Listens for message
  sbSocket.addEventListener("message", (event) => {
    let msg;
    try { msg = JSON.parse(event.data); } catch { return; }

    // Helpful while wiring:
    console.log("[SB] message:", msg);

    // Streamer.bot client examples call this event "Raw.ActionCompleted"
    // but the server payload you receive directly is typically structured as:
    // { event: { source, type }, data: { name, actionId, ... } }
    const source = msg?.event?.source;
    const type   = msg?.event?.type;
    const data   = msg?.data;

    if (source !== "Raw" || type !== "ActionCompleted") return;

    const actionName = data?.name;
    const actionId   = data?.actionId;

    // Switch case to match actions from Streamer.bot, will need to be rewritten if changing action names
    switch (actionName) {
        // Counter hotkeys
        case "HK_AttemptPlus":
            window.panel?.incrementAttempts?.();
            break;
        case "HK_AttemptMinus":
            window.panel?.decreaseAttempts?.();
            break;
        case "HK_AttemptReset":
            window.panel?.resetAttempts?.();
            break;

        // Timer hotkeys
        case "HK_TimerToggle":
            if (window.panel?.state?.timerRunning) window.panel.stopTimer();
            else window.panel?.startTimer?.();
            break;
        case "HK_TimerReset":
            window.panel?.resetTimer?.();
            break;

        // Boss grid hotkeys
        case "HK_SelectRight":
          window.panel?.bossRight?.();
          break;
        case "HK_SelectLeft":
          window.panel?.bossLeft?.();
          break;
        case "HK_SelectUp":
          window.panel?.bossUp?.();
          break;
        case "HK_SelectDown":
          window.panel?.bossDown?.();
          break;
        case "HK_ToggleSelect":
          window.panel?.selectBoss?.();
          break;
        
        // Panel hotkeys
        case "HK_RunReset": // New Run: resets timer and bosses, but adds +1 attempt
            window.panel?.resetRun?.();
            break;
        case "HK_PanelReset": // Resets the entire layout
            window.panel?.resetPanel?.();
            break;
        case "HK_PanelToggle":
            window.panel?.togglePanelVisibility?.();
            break;
    }
  });

  // Handles errors connections
  sbSocket.addEventListener("error", (e) =>
    console.warn("[SB] ws error", e)
  );

  sbSocket.addEventListener("close", () => {
    console.log("[SB] disconnected");
    sbSocket = null; // Allow reconnection on reload
  });

  return sbSocket;
}
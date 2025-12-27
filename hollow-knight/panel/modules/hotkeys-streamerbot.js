// Streamerbot Hotkeys connection

let sbSocket = null; // Module=level guard

export function connectStreamerBotHotkeys({ port = 8080 } = {}) {
    // Connection guard
    if (sbSocket && sbSocket.readyState === WebSocket.OPEN) {
        console.warn("[SB] WebSocket already connected");
        return sbSocket;
    }

    sbSocket = new WebSocket(`ws://127.0.0.1:${port}`);

    sbSocket.addEventListener("open", () => {
    console.log("[SB] connected");

    // Subscribe to action events
    sbSocket.send(JSON.stringify({
      request: "Subscribe",
      id: "hk-sub-1",
      events: {
        raw: ["ActionCompleted"] // or ["Action"] if you prefer
      }
    }));
  });

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

    const actionName = data?.name;     // may be null in docs examples; depends on your config :contentReference[oaicite:5]{index=5}
    const actionId   = data?.actionId; // always there :contentReference[oaicite:6]{index=6}

    // EITHER match by name (easy) OR by id (bulletproof)
    switch (actionName) {
        case "HK_AttemptPlus":
            window.panel?.incrementAttempts?.();
            break;

        case "HK_AttemptMinus":
            window.panel?.decreaseAttempts?.();
            break;
        case "HK_AttemptReset":
            window.panel?.resetAttempts?.();
            break;
        case "HK_TimerToggle":
            if (window.panel?.state?.timerRunning) window.panel.stopTimer();
            else window.panel?.startTimer?.();
            break;
        case "HK_TimerReset":
            window.panel?.resetTimer?.();
            break;
        case "HK_PanelReset":
            window.panel?.resetPanel?.();
            break;
        case "HK_PanelToggle":
            window.panel?.togglePanelVisibility?.();
            break;
    }
  });

  sbSocket.addEventListener("error", (e) =>
    console.warn("[SB] ws error", e)
  );

  sbSocket.addEventListener("close", () => {
    console.log("[SB] disconnected");
    sbSocket = null; // Allow reconnection on reload
  });

  return sbSocket;
}
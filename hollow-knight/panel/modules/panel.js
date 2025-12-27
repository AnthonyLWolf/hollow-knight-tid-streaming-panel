// Panel logic

export function togglePanelVisibility() {
    document.querySelector(".panel-container").classList.toggle("panel-hidden")
}

export function animatePanelReset() {
  const panel = document.querySelector(".panel-container");
  if (!panel) return;

  panel.classList.remove("is-resetting"); // safety
  void panel.offsetWidth;                 // force reflow
  panel.classList.add("is-resetting");
}
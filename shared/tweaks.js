// Vanilla Tweaks panel for the Bluemoon GBC concepts.
// Tweaks: pixel scale (zoom), CRT scanline overlay, sound on/off.
// Implements the host edit-mode protocol (toggle from toolbar).
(function () {
  if (window.__bmTweaksLoaded) return;
  window.__bmTweaksLoaded = true;

  const STATE_KEY = "bm_tweaks";
  const defaults = { zoom: 1.0, crt: false, sound: true };
  let state = Object.assign({}, defaults);
  try {
    const saved = JSON.parse(localStorage.getItem(STATE_KEY) || "{}");
    state = Object.assign(state, saved);
  } catch (e) {}

  function persist() {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
  }

  // ---- Apply tweaks live ----
  function apply() {
    // Sound
    if (window.BM) window.BM.setMuted(!state.sound);
    // CRT
    document.documentElement.classList.toggle("crt", !!state.crt);
    // Zoom — re-scale stage with extra factor
    const stage = document.getElementById("stage");
    if (stage) {
      const sx = window.innerWidth / 1280;
      const sy = window.innerHeight / 720;
      const baseS = Math.min(sx, sy);
      stage.style.transform = `scale(${baseS * state.zoom})`;
    }
  }

  function set(k, v) {
    state[k] = v;
    persist();
    apply();
    // mirror to host so it can write the file (best effort)
    try {
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [k]: v } }, "*");
    } catch (e) {}
    renderControls();
  }

  // ---- Panel UI ----
  let panelEl = null;
  function buildPanel() {
    const p = document.createElement("div");
    p.id = "bmTweaks";
    p.style.cssText = `
      position: fixed;
      bottom: 20px; right: 20px;
      width: 280px;
      background: var(--c0, #fff1d0);
      color: var(--c3, #2a2848);
      border: 4px solid var(--c3, #2a2848);
      box-shadow: inset 0 0 0 2px var(--c2, #7d6a9e);
      padding: 14px 16px 16px;
      font-family: "Press Start 2P", monospace;
      font-size: 9px;
      z-index: 99999;
      letter-spacing: 0.04em;
      display: none;
    `;
    p.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <span style="font-size:11px;">★ TWEAKS</span>
        <button id="bmTweaksClose" style="background:var(--c3,#2a2848); color:var(--c0,#fff1d0); border:none; padding:3px 6px; font-family:inherit; font-size:9px; cursor:pointer;">✕</button>
      </div>
      <div id="bmTweaksBody"></div>
    `;
    document.body.appendChild(p);
    p.querySelector("#bmTweaksClose").addEventListener("click", () => {
      p.style.display = "none";
      try { window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); } catch (e) {}
    });
    return p;
  }

  function renderControls() {
    if (!panelEl) return;
    const body = panelEl.querySelector("#bmTweaksBody");
    body.innerHTML = `
      <div style="margin-bottom:14px;">
        <div style="margin-bottom:8px;">ZOOM · ${(state.zoom).toFixed(2)}×</div>
        <input type="range" id="bmZoom" min="0.5" max="1.5" step="0.05" value="${state.zoom}" style="width:100%;">
      </div>
      <div style="margin-bottom:14px;">
        <div style="margin-bottom:6px;">CRT SCANLINES</div>
        <div style="display:flex; gap:6px;">
          <button data-v="true"  class="tw-pill" data-active="${state.crt ? 'true' : 'false'}">ON</button>
          <button data-v="false" class="tw-pill" data-active="${!state.crt ? 'true' : 'false'}">OFF</button>
        </div>
      </div>
      <div style="margin-bottom:6px;">
        <div style="margin-bottom:6px;">SOUND</div>
        <div style="display:flex; gap:6px;">
          <button data-v="true"  class="tw-snd" data-active="${state.sound ? 'true' : 'false'}">ON</button>
          <button data-v="false" class="tw-snd" data-active="${!state.sound ? 'true' : 'false'}">OFF</button>
        </div>
      </div>
      <div style="margin-top:14px; padding-top:12px; border-top:2px dashed var(--c2,#7d6a9e); font-size:8px; opacity:0.8;">
        Tip: type <span style="background:var(--c3,#2a2848); color:var(--c0,#fff1d0); padding:2px 4px;">BLUEMOON</span> to swap palette.
      </div>
    `;
    // styling for pill buttons
    body.querySelectorAll("button").forEach(b => {
      b.style.cssText = `
        flex:1; padding:6px 8px;
        background: ${b.dataset.active === "true" ? "var(--c3,#2a2848)" : "var(--c0,#fff1d0)"};
        color:    ${b.dataset.active === "true" ? "var(--c0,#fff1d0)" : "var(--c3,#2a2848)"};
        border: 2px solid var(--c3,#2a2848);
        font-family: inherit; font-size:9px;
        cursor: pointer;
      `;
    });
    body.querySelector("#bmZoom").addEventListener("input", (e) => set("zoom", parseFloat(e.target.value)));
    body.querySelectorAll(".tw-pill").forEach(b => b.addEventListener("click", () => set("crt", b.dataset.v === "true")));
    body.querySelectorAll(".tw-snd").forEach(b => b.addEventListener("click", () => set("sound", b.dataset.v === "true")));
  }

  function show() {
    if (!panelEl) panelEl = buildPanel();
    panelEl.style.display = "block";
    renderControls();
  }
  function hide() {
    if (panelEl) panelEl.style.display = "none";
  }

  // ---- Host edit-mode protocol ----
  window.addEventListener("message", (e) => {
    const d = e.data;
    if (!d || typeof d !== "object") return;
    if (d.type === "__activate_edit_mode") show();
    else if (d.type === "__deactivate_edit_mode") hide();
  });

  function init() {
    apply();
    try { window.parent.postMessage({ type: "__edit_mode_available" }, "*"); } catch (e) {}
    // re-apply on resize so zoom keeps working
    window.addEventListener("resize", apply);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

// ---- Bluemoon GBC shared runtime: i18n, sounds, palette, sprites ----
(function () {
  const PALETTES = ["pastel", "dmg", "ocean", "berry", "grape", "mono"];
  // Easter egg: type BLUEMOON to cycle the palette
  const SEQUENCE = "BLUEMOON";
  let buffer = "";
  let paletteIndex = 0;

  function setPalette(name) {
    document.body.setAttribute("data-palette", name);
    try { localStorage.setItem("bm_palette", name); } catch (e) {}
    paletteIndex = Math.max(0, PALETTES.indexOf(name));
    window.dispatchEvent(new CustomEvent("bm:palette", { detail: name }));
  }
  function cyclePalette() {
    paletteIndex = (paletteIndex + 1) % PALETTES.length;
    setPalette(PALETTES[paletteIndex]);
    blip(720, 0.06);
    setTimeout(() => blip(960, 0.06), 70);
  }

  // ---- Audio: tiny chiptune square-wave blips ----
  let ctx = null;
  let muted = false;
  try { muted = localStorage.getItem("bm_mute") === "1"; } catch (e) {}
  function ensureCtx() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    return ctx;
  }
  function blip(freq = 880, duration = 0.06, type = "square", vol = 0.04) {
    if (muted) return;
    const c = ensureCtx();
    if (!c) return;
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }
  function chord(freqs, dur = 0.08) {
    freqs.forEach((f, i) => setTimeout(() => blip(f, dur), i * 50));
  }
  function setMuted(m) {
    muted = !!m;
    try { localStorage.setItem("bm_mute", muted ? "1" : "0"); } catch (e) {}
  }

  // ---- i18n ----
  const dict = {
    en: {
      hello: "Hi! I'm Luca — welcome to my arcade.",
      tutorial_title: "TUTORIAL",
      tutorial_click: "Click the icons or use ARROWS to move.",
      tutorial_keys: "Press A to interact, B to go back.",
      bio: "BIO",
      projects: "PROJECTS",
      contacts: "CONTACTS",
      role: "Indie Game Dev",
      bio_text: "I make small worlds out of pixels and chiptunes. Based in Italy, building games solo as Bluemoon. Currently obsessing over input feel, sprite anims, and weird inventory UIs.",
      ask: "What do you want to know?",
      back: "Back",
      select: "Select",
      view_on_github: "View on GitHub",
      now_playing: "NOW BUILDING",
      level: "LV",
      type: "TYPE",
      year: "YEAR",
      role_label: "ROLE",
      stack: "STACK",
      empty_slot: "— EMPTY —",
      new_game: "NEW GAME",
      continue: "CONTINUE",
      file_a: "FILE A · BIO",
      file_b: "FILE B · PROJECTS",
      file_c: "FILE C · CONTACTS",
      press_start: "PRESS START",
      copyright: "© 2026 BLUEMOON · L. MASTROIANNI",
      tip_arrows: "MOVE",
      tip_a: "ENTER",
      tip_b: "BACK",
      enter_room_bio: "BIO ROOM",
      enter_room_proj: "PROJECT WING",
      enter_room_cnt: "MAILBOX",
      walk_in: "Walk in →",
      sound: "SOUND",
      crt: "CRT",
      zoom: "ZOOM",
      contacts_intro: "Drop me a line — pigeons welcome.",
    },
    it: {
      hello: "Ciao! Sono Luca — benvenuto nella mia sala giochi.",
      tutorial_title: "TUTORIAL",
      tutorial_click: "Clicca le icone o usa le FRECCE per muoverti.",
      tutorial_keys: "Premi A per interagire, B per tornare.",
      bio: "BIO",
      projects: "PROGETTI",
      contacts: "CONTATTI",
      role: "Indie Game Dev",
      bio_text: "Costruisco piccoli mondi fatti di pixel e chiptune. Vivo in Italia e sviluppo giochi in solitaria come Bluemoon. In questo momento sono ossessionato dal feel dei controlli, dalle animazioni sprite e dalle UI di inventario strane.",
      ask: "Cosa vuoi sapere?",
      back: "Indietro",
      select: "Seleziona",
      view_on_github: "Apri su GitHub",
      now_playing: "IN LAVORAZIONE",
      level: "LV",
      type: "TIPO",
      year: "ANNO",
      role_label: "RUOLO",
      stack: "STACK",
      empty_slot: "— VUOTO —",
      new_game: "NUOVA PARTITA",
      continue: "CONTINUA",
      file_a: "FILE A · BIO",
      file_b: "FILE B · PROGETTI",
      file_c: "FILE C · CONTATTI",
      press_start: "PREMI START",
      copyright: "© 2026 BLUEMOON · L. MASTROIANNI",
      tip_arrows: "MUOVI",
      tip_a: "INVIO",
      tip_b: "INDIETRO",
      enter_room_bio: "STANZA BIO",
      enter_room_proj: "ALA PROGETTI",
      enter_room_cnt: "CASSETTA",
      walk_in: "Entra →",
      sound: "AUDIO",
      crt: "CRT",
      zoom: "ZOOM",
      contacts_intro: "Scrivimi pure — accetto piccioni viaggiatori.",
    },
  };
  let lang = "en";
  try { lang = localStorage.getItem("bm_lang") || "en"; } catch (e) {}
  function t(key) { return (dict[lang] && dict[lang][key]) || (dict.en[key] || key); }
  function setLang(l) {
    lang = l;
    try { localStorage.setItem("bm_lang", l); } catch (e) {}
    document.documentElement.lang = l;
    window.dispatchEvent(new CustomEvent("bm:lang", { detail: l }));
  }
  function toggleLang() { setLang(lang === "en" ? "it" : "en"); }

  // ---- Typewriter ----
  function typeInto(el, text, speed = 28, onDone) {
    el.textContent = "";
    el.classList.remove("cursor-blink");
    let i = 0;
    let cancelled = false;
    function tick() {
      if (cancelled) return;
      if (i >= text.length) {
        el.classList.add("cursor-blink");
        if (onDone) onDone();
        return;
      }
      const ch = text[i++];
      el.textContent += ch;
      if (ch !== " " && i % 2 === 0) blip(440 + (i % 5) * 20, 0.015, "square", 0.015);
      setTimeout(tick, ch === "." ? speed * 4 : ch === "," ? speed * 2 : speed);
    }
    tick();
    return { cancel: () => { cancelled = true; } };
  }

  // ---- Easter-egg keylogger for palette swap ----
  window.addEventListener("keydown", (e) => {
    const k = (e.key || "").toUpperCase();
    if (k.length === 1 && /[A-Z]/.test(k)) {
      buffer = (buffer + k).slice(-SEQUENCE.length);
      if (buffer === SEQUENCE) {
        cyclePalette();
        buffer = "";
      }
    }
    if (k === "L" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      toggleLang();
    }
  });

  // ---- Restore prefs on load ----
  function init() {
    try {
      const p = localStorage.getItem("bm_palette");
      if (p && PALETTES.includes(p)) setPalette(p);
      else setPalette("pastel");
    } catch (e) { setPalette("pastel"); }
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent("bm:lang", { detail: lang }));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  // ---- expose ----
  window.BM = {
    t, setLang, toggleLang, getLang: () => lang,
    blip, chord, setMuted, isMuted: () => muted,
    setPalette, cyclePalette, getPalette: () => PALETTES[paletteIndex],
    typeInto,
    PALETTES,
  };
})();

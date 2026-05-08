export type Lang = 'en' | 'it'

export const dict: Record<Lang, Record<string, string>> = {
  en: {
    hello: "Hi! I'm Luca — welcome to my arcade.",
    bio: 'BIO',
    projects: 'PROJECTS',
    contacts: 'CONTACTS',
    role: 'Indie Game Dev',
    bio_text:
      "I’m Luca — also known as BlueMoon. I’m a Juris Doctor and independent creator working across games, tools, and creative media. Under the label Sparrow Tales, I design and develop a wide variety of projects — from videogames and plugins to board games and experimental formats.",
    view_on_github: 'View on GitHub',
    tip_arrows: 'MOVE',
    contacts_intro: 'Drop me a line — pigeons welcome.',
    press_start: 'PRESS START',
    copyright: '© 2026 BLUEMOON · L. MASTROIANNI',
    sound: 'SOUND',
    crt: 'CRT',
    zoom: 'ZOOM',
  },
  it: {
    hello: 'Ciao! Sono Luca — benvenuto nella mia sala giochi.',
    bio: 'BIO',
    projects: 'PROGETTI',
    contacts: 'CONTATTI',
    role: 'Indie Game Dev',
    bio_text:
      'Costruisco piccoli mondi fatti di pixel e chiptune. Vivo in Italia e sviluppo giochi in solitaria come Bluemoon. In questo momento sono ossessionato dal feel dei controlli, dalle animazioni sprite e dalle UI di inventario strane.',
    view_on_github: 'Apri su GitHub',
    tip_arrows: 'MUOVI',
    contacts_intro: 'Scrivimi pure — accetto piccioni viaggiatori.',
    press_start: 'PREMI START',
    copyright: '© 2026 BLUEMOON · L. MASTROIANNI',
    sound: 'AUDIO',
    crt: 'CRT',
    zoom: 'ZOOM',
  },
}

export function translate(lang: Lang, key: string): string {
  return dict[lang]?.[key] ?? dict.en[key] ?? key
}

export interface Project {
  id: string
  name: string
  year: string
  type: string
  stack: string
  status: string
  desc_en: string
  desc_it: string
}

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    name: 'MOONLIGHT',
    year: '2026',
    type: 'Platformer',
    stack: 'GODOT 4 · GLSL',
    status: 'WIP',
    desc_en: 'A tiny hand-pixeled platformer about a robot looking for the moon. Currently building level 3.',
    desc_it: 'Un piccolo platformer in pixel-art su un robot che cerca la luna. Sto costruendo il livello 3.',
  },
  {
    id: 'p2',
    name: 'PIXEL CAFÉ',
    year: '2025',
    type: 'Cozy sim',
    stack: 'UNITY · ASEPRITE',
    status: 'RELEASED',
    desc_en: 'Run an 8-bit café. Brew coffee, hire NPCs, redecorate the floor every season.',
    desc_it: 'Gestisci un caffè a 8 bit. Prepara caffè, assumi NPC, ridecora ogni stagione.',
  },
  {
    id: 'p3',
    name: 'FLOPPY HEART',
    year: '2024',
    type: 'Game jam',
    stack: 'PICO-8',
    status: 'JAM',
    desc_en: "48-hour jam entry. A floppy disk falls in love with a CRT. Won 'Best Mood'.",
    desc_it: "Game jam da 48 ore. Un floppy si innamora di un tubo catodico. 'Best Mood'.",
  },
  {
    id: 'p4',
    name: 'TINY TOWER',
    year: '2024',
    type: 'Tool',
    stack: 'WEB · SVELTE',
    status: 'OPEN SOURCE',
    desc_en: 'A 1-bit pixel painter that exports straight to spritesheets. Free and open source.',
    desc_it: 'Un pixel-painter 1-bit che esporta in spritesheet. Gratis e open source.',
  },
  {
    id: 'p5',
    name: 'BIT BARD',
    year: '2023',
    type: 'Music toy',
    stack: 'WEB AUDIO',
    status: 'EXPERIMENT',
    desc_en: 'A square-wave bard that improvises chiptune over your humming. Definitely cursed.',
    desc_it: 'Un bardo a onda quadra che improvvisa chiptune sul tuo canto. Sicuramente maledetto.',
  },
  {
    id: 'p6',
    name: 'EMPTY SLOT',
    year: '—',
    type: '—',
    stack: '—',
    status: '—',
    desc_en: 'An empty cartridge slot. What will go here?',
    desc_it: 'Uno slot vuoto. Cosa ci andrà?',
  },
]

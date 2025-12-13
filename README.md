# Blue Moon Portfolio 🌙

A retro-modern, vaporwave-styled portfolio website for an indie game developer, built with PixiJS, TypeScript, and GSAP.

## ✨ Features

- **Retro-Modern Design**: Vaporwave aesthetic with pixel art cartridges
- **Interactive Scene**: PixiJS-powered shelf display with floating cartridges
- **Responsive**: Works beautifully on desktop and mobile
- **Dark/Light Mode**: Seamless theme switching
- **Smooth Animations**: GSAP-powered transitions
- **Markdown Content**: Easy project management with frontmatter
- **Easter Eggs**: Hidden surprises (try the Konami code! ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA)
- **Retro Sounds**: Optional 8-bit sound effects

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` to see your portfolio!

### Build for Production

```bash
npm run build
```

## 📝 Adding Projects

Create a new markdown file in `src/data/` with the following frontmatter:

```markdown
---
title: "Your Project Name"
type: "game" # or "coding"
genre: "Puzzle" # optional, for games
platform: "Web" # optional
date: "2024-01-15"
technologies: ["JavaScript", "PixiJS"] # optional
links:
  game: "https://your-game.com" # optional
  source: "https://github.com/..." # optional
  demo: "https://demo.com" # optional
featured: true # optional
---

# Your Project Description

Write your project description here in markdown!

## Features
- Feature 1
- Feature 2
```

## 🎨 Customization

### Colors

Edit the vaporwave color palette in `src/styles/main.scss`:

```scss
$colors-light: (
  accent-pink: #ff6ec7,
  accent-purple: #7b68ee,
  accent-cyan: #00d4ff,
  // ... more colors
);
```

### Cartridge Design

Customize cartridge appearance in `src/components/Cartridge.ts`

### Sounds

Toggle sounds by clicking the moon character in the bottom right, or modify sound behavior in `src/utils/sound.ts`

## 🎮 Easter Eggs

- **Konami Code**: ⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️BA - Activates rainbow vaporwave mode
- **Moon Character**: Click to toggle sound effects
- **Floating Cartridges**: Each cartridge subtly floats and responds to hover

## 🛠️ Tech Stack

- **PixiJS v8**: 2D rendering engine for the interactive scene
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **GSAP**: Smooth animations
- **SCSS**: Powerful styling
- **gray-matter**: Markdown frontmatter parsing

## 📁 Project Structure

```
src/
├── assets/          # Images, sprites
├── components/      # Reusable components (Cartridge, Modal)
├── data/           # Markdown project files
├── scenes/         # PixiJS scenes (MainScene)
├── styles/         # SCSS styles
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── main.ts         # App entry point
```

## 🌟 Credits

- **Font**: Courier New (monospace)
- **Inspiration**: Game Boy aesthetics, Vaporwave culture, Retro gaming
- **Developer**: Luca Mastroianni (Blue Moon)

## 📄 License

MIT License - feel free to use this for your own portfolio!

---

Made with 💜 by Blue Moon

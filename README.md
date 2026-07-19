# 🛁 Skuf's Wet Floor Run – Bathhouse Challenge

A **retro-arcade HTML5 runner game** set in a steamy Russian bathhouse. Run 500 meters across the wet floor, dodge mops and cold water splashes, stay warm, keep your footing, and reach the towel at the exit!

---

## 🎮 Gameplay

| Goal        | Run 500 meters to the warm towel at the end of the bathhouse corridor            |
| ----------- | -------------------------------------------------------------------------------- |
| Temperature | Getting hit by fans or cold water drops your body temp. Hit 0% → instant freeze! |
| Traction    | Running fast on wet tiles wears down grip. Hit 0% → you slip and fall!           |
| Levels      | Each completed level increases difficulty and obstacle density                   |

### Controls

| Key                 | Action                                |
| ------------------- | ------------------------------------- |
| `D` / `→`           | Accelerate (faster but slippery)      |
| `A` / `←`           | Decelerate (safer, restores traction) |
| `Space` / `W` / `↑` | Jump (dodge mops & water pools)       |
| `S` / `↓`           | Duck / Slide (avoid ceiling fans)     |

**Mobile**: On-screen touch buttons are displayed automatically on small screens.

---

## 🏗️ Project Structure

```
skuf-towel-run/
├── index.html          # Main entry point & UI screens
├── game.js             # Core game engine (canvas rendering, physics, audio)
├── sprite-processor.js # Sprite sheet loader & frame extraction
├── style.css           # Retro-arcade visual styles & animations
├── sw.js               # PWA Service Worker for offline support
├── manifest.json       # PWA manifest (installable as native app)
├── package.json        # Project metadata & dev server script
└── assets/
    ├── skuf_sprites.jpg    # Player character sprite sheet
    ├── granny_sprites.jpg  # NPC/obstacle sprite sheet
    ├── icon-192.png        # PWA icon (192×192)
    └── icon-512.png        # PWA icon (512×512)
```

---

## 🚀 Getting Started

### Prerequisites

- Any modern browser (Chrome, Firefox, Edge, Safari)
- Python 3 (for local dev server) **or** any static file server

### Run Locally

```bash
# Using the built-in npm script (requires Python 3)
npm run dev
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

Alternatively, serve with any static server:

```bash
npx serve .
# or
python -m http.server 8080
```

### Install as PWA

The game is fully installable as a Progressive Web App. Open it in Chrome/Edge and use the browser's **"Install App"** prompt. Once installed it works completely **offline**.

---

## ✨ Features

- **Retro CRT aesthetic** – scanline overlay, vignette, and pixel-perfect canvas rendering
- **Synthesized audio** – all sound effects and BGM generated procedurally via the Web Audio API (no audio files needed)
- **PWA / offline support** – Service Worker caches all assets for offline play
- **Mobile controls** – touch-friendly overlay buttons for phone & tablet play
- **Multi-level progression** – difficulty scales with each completed level
- **Resume system** – die mid-run and get one chance to continue from where you fell

---

## 🛠️ Technical Details

| Technology         | Usage                                     |
| ------------------ | ----------------------------------------- |
| HTML5 Canvas       | Game rendering (960×540 px)               |
| Vanilla JavaScript | All game logic, physics, audio            |
| Web Audio API      | Procedural SFX + chiptune BGM             |
| CSS Animations     | UI transitions, steam clouds, CRT effects |
| Service Worker     | Offline asset caching                     |
| PWA Manifest       | Installable web app                       |

---

## 📄 License

ISC © Antigravity Coding Assistant

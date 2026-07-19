# AGENTS.md – Skuf's Wet Floor Run

Guidelines and context for AI coding agents working on this project.

---

## Project Overview

**Skuf's Wet Floor Run** is a single-file-stack HTML5 retro-arcade runner game. It uses no build tools, no frameworks, and no external dependencies — everything is pure vanilla HTML, CSS, and JavaScript served from a static file server.

The game targets a **960×540 px canvas** and runs at 60 fps via `requestAnimationFrame`.

---

## Architecture & File Responsibilities

| File                  | Responsibility                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`          | Game shell: canvas element, all UI screens (Start, Game Over, Victory, Resume), HUD overlay, mobile controls, PWA boilerplate           |
| `game.js`             | **Core engine** — game loop, physics, collision detection, obstacle spawning, level progression, player state, HUD updates, audio calls |
| `sprite-processor.js` | Sprite sheet loader: reads `skuf_sprites.jpg` and `granny_sprites.jpg`, slices frames, exposes them to `game.js`                        |
| `style.css`           | All visual styling: CRT overlay, scanline effect, steam clouds, HUD bars, UI screens, mobile controls, button styles                    |
| `sw.js`               | Service Worker: caches all static assets for PWA offline support                                                                        |
| `manifest.json`       | PWA manifest: app name, icons, display mode, theme colours                                                                              |
| `assets/`             | Static sprites and PWA icons — do not modify sprite sheets without updating frame counts in `sprite-processor.js`                       |

---

## Key Constraints

- **No build step.** Do not introduce Webpack, Vite, Rollup, or any bundler. The game must be runnable by opening `index.html` directly in a browser or via a plain static server.
- **No external libraries.** Do not add npm runtime dependencies. All logic must stay in vanilla JS.
- **No TypeScript.** Keep all JS as plain ES2020+ JavaScript.
- **Canvas-first rendering.** All gameplay visuals are drawn on the `<canvas id="gameCanvas">` element. DOM overlays are only used for UI screens and the HUD.
- **Audio is synthesized.** All sound effects and BGM are generated via the Web Audio API — do not add audio files.

---

## Code Conventions

- **Class-based architecture** — each major subsystem is a class (`GameAudio`, `Player`, `ObstacleManager`, etc.).
- **Game loop pattern** — the main loop is driven by `requestAnimationFrame`; delta time is computed per frame and capped to prevent spiral-of-death on tab blur.
- **No global state pollution** — all state lives inside class instances; only the top-level `game` object is attached to `window` (for debug access).
- **Magic numbers** — gameplay tuning constants (speeds, decay rates, gravity) are defined as named constants at the top of `game.js`. Prefer editing those over inline literals.
- **CSS variables** — all colours and glow values are defined as CSS custom properties on `:root` in `style.css`. Use variables, not hex literals, in new CSS.

---

## Common Tasks

### Adding a new obstacle type

1. Define the obstacle's spawn logic in the `ObstacleManager` class inside `game.js`.
2. Add a `draw()` case for it in the canvas render pass.
3. Add collision detection in the player update loop.
4. If it has a visual effect (e.g. temperature drain), update `Player.applyHazardEffect()`.

### Adding a new level

Levels are configured via an array of difficulty descriptors near the top of `game.js`. Increment `LEVEL_COUNT` and add a new entry with the desired obstacle density, speed multiplier, and hazard mix.

### Changing game balance

Tune the following constants at the top of `game.js`:

| Constant              | Effect                                    |
| --------------------- | ----------------------------------------- |
| `BASE_SPEED`          | Starting scroll speed                     |
| `MAX_SPEED`           | Speed cap                                 |
| `TEMP_DECAY_RATE`     | How fast temperature drops per hazard hit |
| `TRACTION_DECAY_RATE` | How fast traction decays at high speed    |
| `TRACTION_REGEN_RATE` | Traction recovery when decelerating       |
| `LEVEL_DISTANCE`      | Meters required to complete a level       |

### Updating sprites

- Sprite sheets live in `assets/skuf_sprites.jpg` and `assets/granny_sprites.jpg`.
- Frame dimensions and counts are configured in `sprite-processor.js`.
- If you replace a sheet, update `FRAME_WIDTH`, `FRAME_HEIGHT`, and `FRAME_COUNT` in `sprite-processor.js` to match.

---

## PWA & Service Worker

- `sw.js` uses a **cache-first** strategy.
- When adding new static assets (images, fonts, etc.), add their paths to the `CACHE_ASSETS` array inside `sw.js`.
- Bump the `CACHE_NAME` version string in `sw.js` whenever cached assets change, to force clients to refresh.

---

## Dev Server

```bash
npm run dev   # starts: python -m http.server 8080
```

Open [http://localhost:8080](http://localhost:8080). No hot-reload — refresh the browser manually after edits.

---

## Testing

There is no automated test suite. Verify changes by:

1. Opening the game in a browser and playing through at least one full level.
2. Checking the browser console for JavaScript errors.
3. Testing on mobile viewport (Chrome DevTools → device toolbar) to confirm touch controls appear and function.
4. Verifying PWA offline mode: load the page once, then toggle the Network tab to "Offline" and reload.

---

## Do Not

- Do not remove the `?v=1.1.3` cache-busting query strings on `<script>` tags without bumping the version number.
- Do not move game logic into `index.html` inline scripts — keep it in `game.js`.
- Do not use `alert()`, `confirm()`, or `prompt()` — the game has its own modal UI system.
- Do not add CSS `!important` declarations; specificity is intentionally managed through the existing selector hierarchy.

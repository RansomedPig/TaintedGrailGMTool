# Tainted Grail: Song of a Dying World — Player Help Document

A single-page web companion for the *Tainted Grail: Song of a Dying World* tabletop RPG.
Static HTML/CSS/JS — no build step, no dependencies. Just open `index.html` in a browser.

> Unofficial fan-made tool for private use. Game rules, setting, and artwork are the
> property of Awaken Realms. This app is not affiliated with or endorsed by them.

## Features

- **Reference Guide** — setting, rules overview, Ways/Domains, combat, Wyrdness, glossary.
- **Character Creator** — step-by-step build (Ways, Domains, Advantages/Disadvantages, equipment, XP).
- **Character Sheet** — fillable parchment sheet with save/load and a Resolution-roll modal.
- **Game Leader** — starting-XP calculator and leader tools.
- **Card Decks** — searchable/filterable Bargaining, Chronicle, Magic, Optional, and Special cards.
- **Bestiary & Encounters** — encounters and foes on one difficulty scale, with an
  **Encounter Randomizer** that builds a balanced fight for a 1–4 player party.
- **Pre-Gen Characters** — ready-to-play Guardians.
- **Adventures** — scenario summaries.

## Running it

No server or install required:

- Double-click `index.html`, **or**
- Use a local static server for cleaner routing, e.g. VS Code's Live Server extension.

## Project structure

```
.
├── index.html          # Main app shell: Reference, Creator, Sheet, Game Leader tabs
├── app.js              # App logic for the index.html tabs
├── styles.css          # Shared stylesheet (palette, nav, layout) used by every page
├── decks.html          # Card Decks browser
├── bestiary.html       # Bestiary & Encounters + randomizer UI
├── bestiary-data.js    # Bestiary data (encounters, creatures, foes) + render/randomizer logic
├── pregens.html        # Pre-generated characters
├── adventures.html     # Adventure summaries
├── nav.html            # Shared navigation snippet (reference)
├── King_Arthur.jpg     # Background art
├── King_Arthur.png     # Background art (alt)
├── Song of a Dying World.png
└── logo-D1V4BAAT.png
```

## Notes

- Pure front-end; all state (character sheets) is kept in the browser via `localStorage`.
- Fonts are loaded from Google Fonts (Cinzel, Cinzel Decorative, Cormorant Garamond).
- The Bestiary content and difficulty scale were adapted into the game's own
  1D10 + Domain + Way resolution system.

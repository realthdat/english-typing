# English Typing

A local **Electron** desktop app for learning English by rewriting — line by line, from meaning, or from memory. Everything stays on your device: no account, no cloud sync, no network requests from the app itself.

---

## Features

- **Writing practice** with four levels:
  - **Copy the text** — exact match (case, spaces, punctuation); live green / red / gray feedback
  - **Recall with hints** — first letter of each word; scored on Check
  - **Write from memory** — reference hidden until you reveal it
  - **Blind practice** — no reference; live character feedback; case and punctuation optional
- **Vocabulary** — write English words from their meanings
- **Whole-passage recall** — rewrite the full text (Enter inserts a new line)
- **Your library** — add a personal passage (one sentence per line)
- **UI languages** — Vietnamese, English, Simplified Chinese
- **Themes** — dark mode by default; light mode toggle (saved locally)
- **Offline fonts** — bundled Roboto for writing areas

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| **Enter** | Check answer; advance when correct (in whole-passage recall: new line) |
| **Ctrl+Enter** | Check without advancing |
| **Backspace** | Fix mistakes (especially useful in Copy) |

Only a correct answer unlocks the next sentence. Wrong answers stay editable.

### Practice controls

- **Practice this sentence again** — clears the current attempt
- **Practice from the beginning** — restarts the lesson without erasing learned progress
- **Practice again** — appears when you finish a lesson
- **Reset all Practice** — clears writing and vocabulary progress, resets cursors, returns to the first built-in sentence in Copy mode (keeps personal passage, language, and theme)

---

## Requirements

- **Node.js** 18+ (for development)
- **Windows** x64 recommended for the portable build (`npm run dist:win`)

---

## Quick start

```bash
npm install
npm run dev
```

This launches the Electron window via `tools/launch.cjs`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` / `npm start` | Run the app locally |
| `npm test` | Unit tests (`tests/*.test.mjs`) |
| `npm run typecheck` | TypeScript check (`tsc --noEmit`) |
| `npm run build` | Bundle renderer into `.cache/app.js` (esbuild) |
| `npm run dist:win` | Build + package Windows x64 portable EXE |
| `node tools/launch.cjs --smoke` | Smoke-test the real Electron window (separate test storage) |

### Portable Windows build

```bash
npm run dist:win
```

Output: `release/English-Typing-Portable.exe`  
Open it without installing Node.js. The executable is **unsigned**. Packaging may download build tools; the app itself does not make network requests.

---

## Project structure

```
english-typing/
├── src/
│   ├── main/           # Electron main process
│   ├── renderer/       # UI (HTML / CSS / JS) + bundled fonts
│   └── shared/         # Typing / learning logic + i18n
├── tools/              # launch + esbuild helpers
├── tests/              # Node test runner suites
├── docs/design.md      # Scoring & storage design notes
├── electron-builder.json
├── package.json
└── tsconfig.json
```

---

## Privacy

- No network requests from the app
- Progress and personal passages live in the local Electron profile (`EnglishTyping` userData)
- No accounts or cloud sync
- Unfinished input is not persisted; personal passage completion is not tracked

See [docs/design.md](docs/design.md) for scoring and storage details.

---

## License notes

- App code: see repository owner terms
- **Roboto** font: SIL Open Font License (see `src/renderer/fonts/OFL-Roboto.txt`)

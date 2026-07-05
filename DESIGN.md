# Code Typing Speed Game — Design

## Concept

A typing speed test that uses real code snippets instead of prose. Tracks time, WPM, and accuracy.

## Stack

Plain HTML/CSS/JS. No build step, no framework, no backend. Opens directly in a browser.

## File structure

```
index.html    - markup/layout
style.css     - styling (dark editor theme, layout, highlight colors)
snippets.js   - hardcoded snippet data
script.js     - game logic
```

## Snippet data (`snippets.js`)

```js
const SNIPPETS = [
  { id, language, difficulty, code },
  ...
];
```

- 8-12 short (3-8 line) snippets across JS, Python, and one more language (CSS or shell).
- Pre-normalized: spaces only for indentation (no tabs), `\n` line endings, no trailing whitespace — keeps character-by-character comparison unambiguous.

## Game state machine (`script.js`)

States: `IDLE -> TYPING -> FINISHED`, held in one `gameState` object:
`{ status, currentSnippet, startTime, endTime, totalKeystrokes, correctKeystrokes }`.

Key functions:
- `loadSnippet(snippet)` — resets to IDLE, renders target snippet, clears input/stats.
- `pickRandomSnippet(excludeId)` — random pick excluding the current snippet ("New Snippet" button).
- `handleInput(event)` — starts timer via `performance.now()` on first keystroke, updates live diff rendering, tallies keystrokes for accuracy, checks for exact-match completion, calls `finishGame()`.
- `renderDiff(target, typed)` — wraps each target character in a `<span>` with class `correct` / `incorrect` / `pending` / `current` for live highlighting.
- `finishGame()` / `computeStats(...)`:
  - `timeSeconds = (endTime - startTime) / 1000`
  - `wpm = (target.length / 5) / (timeSeconds / 60)`
  - `accuracy = correctKeystrokes / totalKeystrokes * 100`
- Restart resets the same snippet; New Snippet picks a random different one. No language/difficulty filter (kept simple).

## Formatting quirks handling

- `<textarea>` (not `<input>`) for multi-line typing, monospace font matching the display so text visually lines up.
- Intercept `Tab` keydown to insert spaces instead of shifting focus.
- `autocomplete="off"`, `autocapitalize="off"`, `spellcheck="false"` on the textarea.
- Comparison is strict character-for-character (including newlines/indentation), no fuzzy whitespace matching.

## Mistake handling — type-through

User is never blocked by a wrong keystroke. Incorrect characters render red on the snippet display above and increment the mistake tally; the user can keep typing forward or backspace to fix. Accuracy reflects however many keystrokes ended up wrong.

## UI layout

Single centered card, **dark editor-like theme** (dark slate/near-black background, light gray body text, monospace code font, bright accent color for buttons/cursor — VS Code Dark+-ish palette):

1. Header/title + language badge (small colored pill) for the current snippet.
2. **Live timer**: running seconds counter (e.g. `12.4s`), ticking from first keystroke until FINISHED.
3. Snippet display (`<pre><code>`) with live highlighted spans — the *only* place correctness coloring appears: `correct` (green), `incorrect` (red/red background), `pending` (muted gray), `current` (underline/highlight marking next expected char).
4. `<textarea>` input directly below, matching font/line-height, plain styling (no per-character coloring), visible caret.
5. Results panel (hidden until FINISHED): time, WPM, accuracy — a few stat cards in a row.
6. Restart + New Snippet buttons — accent-colored, rounded, below the results/input area.

### Palette

- Background: `#1e1e1e`-ish
- Text: `#d4d4d4`-ish
- Monospace stack: `ui-monospace, "Fira Code", "Courier New", monospace`
- Accent (buttons/timer/cursor): `#569cd6`-ish
- Correct: `#4ec9b0`-ish
- Incorrect: `#f14c4c`-ish
- Subtle rounded corners + card shadow on the container

## Verification

Open `index.html` directly in a browser (no server needed). Manually test: timer starts on first keystroke, live highlighting updates correctly on each input, Tab inserts spaces, completion triggers only on an exact full match, stats look sane for a known typing speed, type-through works past mistakes without blocking, and Restart/New Snippet work from IDLE/TYPING/FINISHED states.

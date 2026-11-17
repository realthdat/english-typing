# English Typing

This is a standalone Electron desktop app in D:\MINE\English Typing.
It does not use the lolPing hooks, settings, network, or release process.

The sandboxed renderer has no Node access or preload bridge. All content
is bundled locally. Navigation and new windows are blocked. No network
requests are made. Progress and personal passages use localStorage in a
dedicated Electron userData directory named EnglishTyping.

Writing practice has four levels. Copy shows each reference character in
gray, typed matches in green with a subtle glow, and mistakes in red. The
native textarea handles typing, selection, Backspace and composition; a
separate display follows its selection and draws a blinking caret. Motion
is disabled when reduced motion is requested. Grapheme segmentation keeps
combined accents and emoji together. Copy completion requires exact case,
spaces and punctuation. It unlocks Next without advancing automatically.

Enter submits sentence and vocabulary answers, then advances if correct.
A completed sentence advances immediately on Enter. Incorrect answers stay
editable and retain focus. Ctrl+Enter checks without advancing. Enter in
whole-passage recall keeps its native newline behavior. Composition and
modifier keys retain native behavior; held Enter does not skip sentences.

The interface uses a compact sidebar with one set of navigation controls,
white cards on a cool gray background, and an indigo action accent. Practice
text sits directly on the app background with no enclosing card or input
border. A single horizontal line slides past a reading point at 32% of the
available width. The active character scales to 1.24 with a short underline
and the following character scales to 1.04. Eased transitions keep the
focus effect subtle. Correct characters have a soft green text shadow,
with a wider glow on hover; wrong ones remain red.
The line follows native selection and repositions on resize. Glyph nodes
are reused so zoom transitions continue between keystrokes. Long text is
clipped with fading edges. Reduced motion makes zoom and sliding instant.
Roboto is bundled locally with its SIL Open Font License for all writing
areas. Font-load events recenter the track after metrics become available.
System sans-serif fonts serve the rest of the interface. Both work offline.
Keyboard shortcuts appear beside the
actions. Colors, hover feedback and visible focus follow the local
UI/UX Pro Max skill at D:\MINE\UXUI. No remote fonts or icon hosts are used.
Dark mode is the default; the header switch persists a light or dark
preference without clearing input or changing the current lesson.

Hint level shows only the initial letter of each word. Self level hides
the reference. Both withhold correctness until Check is pressed and use
normalized word comparison, ignoring punctuation, case and whitespace.
Blind practice hides all reference characters, hints and expected-character
tooltips, including after an incorrect check. Only typed text appears, with
live green matches and red errors. Comparison ignores case and punctuation,
but requires words in order with whitespace between them. Repeated spaces
are accepted; punctuation alone cannot replace a word separator. Mistakes
are compared within each word so later words keep their own alignment.
A complete answer unlocks Next immediately; Enter advances as in Copy.
The live character score measures current input, not historical mistakes.
Word-level edit distance provides partial memory scores. Whole-passage
recall and the ten vocabulary exercises keep their existing scoring.
All study modes share the same borderless Roboto typing track, caret,
zoom, theme styling and action row. Memory and vocabulary hide the target
and emphasize the latest typed character, without giving live correctness
hints. A successful check turns the entered answer green. Paragraph
newlines remain native input and appear as arrow markers on the track.
Showing or hiding the reference preserves the answer and its selection.
Completing with hints still counts as practice; it is not an exam score.

Practice again clears the current answer and keeps the selected level.
Practice from the beginning restarts the current lesson, vocabulary set
or personal passage without clearing learned progress. At the end of a
practice, Next becomes Practice again. Saved progress can be cleared only
through the separate reset control and its confirmation dialog. Reset all
Practice clears all learned lines and vocabulary, returns both built-in
and personal lesson cursors to zero, restores Copy mode and opens the
first built-in line. The personal passage, language and theme are retained.

Progress is validated on load. Storage failures show a session-only notice.
The interface has Vietnamese, English and Simplified Chinese dictionaries
in src/shared/i18n.ts. The supplied prayer retains its original wording.

Run npm run dev. Run npm test and npm run typecheck for checks.
Install the pinned development dependencies with npm install before
running the app for the first time.

Windows packaging uses electron-builder and an explicit file allowlist.
The portable x64 target includes the bundled renderer, HTML, CSS and main
process in app.asar. Runtime dependencies are limited to Electron built-ins.
Run npm run dist:win. The output executable is unsigned. Smoke screenshots
are written to the test userData directory so packaged archives stay read-only.


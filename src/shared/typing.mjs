const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const split = text => Array.from(segmenter.segment(text), item => ({ text: item.segment, offset: item.index }));
const withoutPunctuation = text => text.replace(/\p{P}/gu, '').toLowerCase();
const blindWords = text => text.split(/\s+/u).map(withoutPunctuation).filter(Boolean);

/** Checks word positions while preserving raw input offsets and hiding the reference. */
function blindState(expected, actual, selectionStart, selectionEnd, direction) {
  const reference = blindWords(expected);
  const words = blindWords(actual);
  const statuses = new Map();
  let wordIndex = 0;
  let previousComplete = true;
  for (const match of actual.matchAll(/\s+|\S+/gu)) {
    const value = match[0];
    if (/^\s/u.test(value)) {
      for (const glyph of split(value)) statuses.set(match.index + glyph.offset, previousComplete);
      continue;
    }
    const normalized = withoutPunctuation(value);
    let letterIndex = 0;
    const wanted = split(reference[wordIndex] ?? '');
    for (const glyph of split(value)) {
      const punctuation = !withoutPunctuation(glyph.text);
      statuses.set(match.index + glyph.offset, punctuation || glyph.text.toLowerCase() === wanted[letterIndex]?.text);
      if (!punctuation) letterIndex++;
    }
    if (normalized) {
      previousComplete = normalized === reference[wordIndex];
      wordIndex++;
    }
  }
  const cursor = direction === 'backward' ? selectionStart : selectionEnd;
  const characters = split(actual).map(glyph => ({
    character: glyph.text, expected: '', offset: glyph.offset,
    status: statuses.get(glyph.offset) ? 'correct' : 'wrong',
    cursor: glyph.offset === cursor,
    selected: glyph.offset < selectionEnd && glyph.offset + glyph.text.length > selectionStart
  }));
  const correct = characters.filter(glyph => glyph.status === 'correct').length;
  const exact = reference.length > 0 && words.join(' ') === reference.join(' ');
  return { characters, endCursor: cursor === actual.length, typed: characters.length,
    total: split(reference.join(' ')).length,
    liveAccuracy: characters.length ? Math.round(correct / characters.length * 100) : 0,
    accuracy: exact ? 100 : Math.min(99, Math.round(correct / Math.max(characters.length, split(reference.join(' ')).length, 1) * 100)), exact };
}

/** Keeps the active character at the reading point as the line slides past it. */
export function typingTrackOffset(viewportWidth, characterLeft, characterWidth) {
  return viewportWidth * .32 - characterLeft - characterWidth / 2;
}

/** Keeps paragraph newlines and composition intact while making sentence practice keyboard driven. */
export function enterAction({ mode, passed, ctrlKey, shiftKey, altKey, metaKey, composing, repeat }) {
  if (composing || shiftKey || altKey || metaKey) return 'native';
  if (mode === 'recall' && !ctrlKey) return 'native';
  if (repeat) return 'ignore';
  if (ctrlKey) return 'check';
  return passed ? 'next' : 'submit';
}

/** Derives the visible typing state without changing the input or its selection. */
export function typingState(expected, actual, level = 'copy', selectionStart = actual.length, selectionEnd = selectionStart, direction = 'forward') {
  if (level === 'blind') return blindState(expected, actual, selectionStart, selectionEnd, direction);
  const reference = split(expected);
  const entered = split(actual);
  const length = level === 'self' ? entered.length : Math.max(reference.length, entered.length);
  const cursor = Math.min(Math.max(direction === 'backward' ? selectionStart : selectionEnd, 0), actual.length);
  let correct = 0;
  const characters = Array.from({ length }, (_, i) => {
    const wanted = reference[i]?.text ?? '';
    const typed = entered[i]?.text;
    const offset = entered[i]?.offset ?? actual.length + (reference[i]?.offset ?? expected.length) - (reference[entered.length]?.offset ?? expected.length);
    let status = typed === undefined ? 'pending' : !wanted ? 'extra' : typed === wanted ? 'correct' : 'wrong';
    if (typed === wanted) correct++;
    let character = typed ?? wanted;
    if (level !== 'copy' && typed !== undefined) status = 'entered';
    if (level === 'hint' && typed === undefined && /[\p{L}\p{N}]/u.test(wanted) && i > 0 && /[\p{L}\p{N}]/u.test(reference[i - 1].text)) character = '·';
    return {
      character,
      expected: wanted,
      status,
      offset,
      cursor: offset === cursor,
      selected: typed !== undefined && offset < selectionEnd && offset + typed.length > selectionStart
    };
  });
  return {
    characters,
    endCursor: cursor === actual.length && (entered.length >= reference.length || level === 'self'),
    typed: entered.length,
    total: reference.length,
    liveAccuracy: entered.length ? Math.round(correct / entered.length * 100) : 0,
    accuracy: Math.round(correct / Math.max(reference.length, entered.length, 1) * 100),
    exact: actual === expected
  };
}

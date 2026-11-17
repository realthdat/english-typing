import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { typingState, enterAction, typingTrackOffset } from '../src/shared/typing.mjs';

describe('typingState', () => {
  it('hides every reference character in blind practice', () => {
    const state = typingState('Our Father,', '', 'blind');
    assert.deepEqual(state.characters, []);
    assert.equal(state.endCursor, true);
    assert.equal(state.exact, false);
  });
  it('accepts case and optional punctuation while requiring spaces between words', () => {
    for (const input of ['our father', 'OUR, FATHER;', '  Our   Father  ', 'our , father']) {
      assert.equal(typingState('Our Father,', input, 'blind').exact, true, input);
    }
    for (const input of ['ourfather', 'our,father', 'father our', 'our', 'our fath', 'our father extra', ', ;']) {
      assert.equal(typingState('Our Father,', input, 'blind').exact, false, input);
    }
  });
  it('colors blind mistakes immediately and preserves word alignment after a typo', () => {
    const state = typingState('Our Father who', 'oux father who', 'blind');
    assert.equal(state.characters[2].status, 'wrong');
    assert.ok(state.characters.slice(4).every(character => character.status === 'correct'));
    assert.ok(state.characters.every(character => character.expected === ''));
    assert.ok(typingState('Our Father', 'our father', 'blind').characters.every(character => character.status === 'correct'));
    assert.equal(typingState('Our Father', 'ou r father', 'blind').characters[2].status, 'wrong');
  });
  it('keeps native cursor offsets and selection after ignored punctuation in blind practice', () => {
    const state = typingState('Our Father', 'OUR, father', 'blind', 3, 6, 'backward');
    assert.equal(state.characters[3].cursor, true);
    assert.equal(state.characters[3].status, 'correct');
    assert.deepEqual(state.characters.filter(character => character.selected).map(character => character.character), [',', ' ', 'f']);
    assert.equal(state.endCursor, false);
  });
  it('keeps the active character centered at the reading point for long lines', () => {
    for (const left of [0, 40, 9000]) {
      const shift = typingTrackOffset(1000, left, 30);
      assert.equal(left + 15 + shift, 320);
    }
  });
  it('adjusts the reading point when the window narrows', () => {
    assert.equal(typingTrackOffset(500, 600, 20) + 610, 160);
  });
  it('advances completed sentences and submits unfinished answers with Enter', () => {
    assert.equal(enterAction({ mode: 'practice', passed: true }), 'next');
    assert.equal(enterAction({ mode: 'practice', passed: false }), 'submit');
    assert.equal(enterAction({ mode: 'words', passed: false }), 'submit');
  });
  it('keeps Ctrl Enter as a check without advancing', () => {
    assert.equal(enterAction({ mode: 'practice', passed: true, ctrlKey: true }), 'check');
    assert.equal(enterAction({ mode: 'recall', ctrlKey: true }), 'check');
  });
  it('preserves newlines in passages and native composition and modifier keys', () => {
    assert.equal(enterAction({ mode: 'recall', passed: true }), 'native');
    for (const modifier of ['composing', 'shiftKey', 'altKey', 'metaKey']) {
      assert.equal(enterAction({ mode: 'practice', passed: true, [modifier]: true }), 'native');
    }
  });
  it('ignores held Enter so a new sentence is not submitted accidentally', () => {
    assert.equal(enterAction({ mode: 'practice', passed: true, repeat: true }), 'ignore');
    assert.equal(enterAction({ mode: 'practice', passed: false, repeat: true }), 'ignore');
  });
  it('shows the reference as pending with a cursor at the first character', () => {
    const state = typingState('Our Father,', '');
    assert.ok(state.characters.every(character => character.status === 'pending'));
    assert.equal(state.characters[0].cursor, true);
    assert.equal(state.exact, false);
  });
  it('distinguishes correct characters, mistakes and extra input', () => {
    const state = typingState('Our', 'Oux!');
    assert.deepEqual(state.characters.map(character => character.status), ['correct', 'correct', 'wrong', 'extra']);
    assert.equal(state.characters[2].character, 'x');
    assert.equal(state.characters[2].expected, 'r');
    assert.equal(state.liveAccuracy, 50);
    assert.equal(state.endCursor, true);
  });
  it('requires punctuation, case and spaces in copy mode', () => {
    for (const input of ['our Father,', 'Our Father', 'Our  Father,', 'Our Father, ']) {
      assert.equal(typingState('Our Father,', input).exact, false);
    }
    assert.equal(typingState('Our Father,', 'Our Father,').exact, true);
  });
  it('clears an error when input is deleted and corrected', () => {
    assert.equal(typingState('Our', 'Ox').characters[1].status, 'wrong');
    assert.equal(typingState('Our', 'O').characters[1].status, 'pending');
    assert.equal(typingState('Our', 'Ou').characters[1].status, 'correct');
  });
  it('follows the native cursor and selection inside existing input', () => {
    const state = typingState('Our Father', 'Our Fat', 'copy', 2, 5, 'backward');
    assert.equal(state.characters[2].cursor, true);
    assert.deepEqual(state.characters.filter(character => character.selected).map(character => character.character), ['r', ' ', 'F']);
    assert.equal(state.endCursor, false);
    assert.equal(typingState('Our Father', 'Our Fat', 'copy', 2, 5).characters[5].cursor, true);
  });
  it('shows only initial letters as hints without revealing correctness', () => {
    assert.equal(typingState('Our Father,', '', 'hint').characters.map(character => character.character).join(''), 'O·· F·····,');
    assert.equal(typingState('Our', 'x', 'hint').characters[0].status, 'entered');
  });
  it('hides the reference and correctness when writing from memory', () => {
    const state = typingState('Our Father,', 'hello', 'self');
    assert.equal(state.characters.map(character => character.character).join(''), 'hello');
    assert.ok(state.characters.every(character => character.status === 'entered'));
    assert.equal(typingState('Our', '', 'self').endCursor, true);
  });
  it('treats combined accents and emoji as single visible characters', () => {
    const state = typingState('á🙂b', 'á🙂', 'copy', 4);
    assert.equal(state.typed, 2);
    assert.equal(state.total, 3);
    assert.equal(state.characters[2].cursor, true);
    assert.equal(state.characters[2].offset, 4);
  });
});

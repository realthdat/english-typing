import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { compare, normalizeProgress, resetAllPractice, lines } from '../src/shared/learning.mjs';
describe('learning', () => {
  it('resets every learned line and word while preserving passages and preferences', () => {
    const previous = { line: 7, completed: [0, 3, 7], words: [0, 6], custom: 'My saved passage.', language: 'en', theme: 'light' };
    const result = resetAllPractice(previous);
    assert.deepEqual(result, { ...previous, line: 0, completed: [], words: [] });
    assert.deepEqual(previous.completed, [0, 3, 7]);
  });
  it('normalizes old and invalid theme preferences', () => {
    assert.equal(normalizeProgress({}).theme, 'dark');
    assert.equal(normalizeProgress({ theme: 'broken' }).theme, 'dark');
    assert.equal(normalizeProgress({ theme: 'light' }).theme, 'light');
  });
  it('preserves the eleven original lines', () => { assert.equal(lines.length, 11); assert.equal(lines[10], 'Amen.'); });
  it('accepts different capitalization and punctuation', () => { assert.equal(compare(lines[0], 'our father who art in heaven').exact, true); });
  it('rejects missing, extra and reordered words', () => { for (const answer of ['Our Father who in heaven', 'Our Father who art in heaven today', 'Father Our who art in heaven']) assert.equal(compare(lines[0], answer).exact, false); });
  it('does not penalize all later words for one missing word', () => { assert.equal(compare('one two three four', 'one three four').accuracy, 75); });
  it('accepts multiline recall', () => { assert.equal(compare(lines.join('\n'), lines.join(' ')).exact, true); });
  it('normalizes broken and old progress', () => { assert.deepEqual(normalizeProgress(null).completed, []); assert.equal(normalizeProgress({ line: 99 }).line, 0); assert.deepEqual(normalizeProgress({ completed: [0, 0, -1, '2', 99], words: [2, 2] }).completed, [0]); assert.deepEqual(normalizeProgress({ words: [2, 2] }).words, [2]); });
});

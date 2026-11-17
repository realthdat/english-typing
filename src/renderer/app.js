import { translations } from '../shared/i18n.ts';
import { lines, vocabulary, compare, normalizeProgress, resetAllPractice } from '../shared/learning.mjs';
import { typingState, enterAction, typingTrackOffset } from '../shared/typing.mjs';

const key = 'english-typing.progress.v1';
let storageAvailable = true;
let progress;
try { progress = normalizeProgress(JSON.parse(localStorage.getItem(key) || '{}')); }
catch { progress = normalizeProgress({}); }
let mode = 'practice';
let word = 0;
let customLine = 0;
let personal = false;
let hidden = false;
let passed = false;
let draft = '';
let typingLevel = 'copy';
let finished = false;
let typingResizeObserver;
const app = document.querySelector('#app');
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const t = name => translations[progress.language][name];
const activeLines = () => personal ? progress.custom.split('\n').map(s => s.trim()).filter(Boolean) : lines;
const index = () => mode === 'words' ? word : personal ? customLine : progress.line;
const target = () => mode === 'words' ? vocabulary[word][0] : mode === 'recall' ? activeLines().join('\n') : activeLines()[index()];
const activeTypingLevel = () => mode === 'practice' ? typingLevel : 'self';
const icons = {
  practice: '<path d="m16 3 5 5-12 12-6 1 1-6Z"/><path d="m13 6 5 5"/>',
  words: '<path d="m3 18 5-12 5 12M5 14h6m4-4h6m-3 0v8m-3-1c2 2 4 2 6 0"/>',
  recall: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
  library: '<path d="M3 4h7v16H3zM14 4h7v16h-7zM6 8h1m10 0h1M6 16h1m10 0h1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M21 13a9 9 0 0 1-10-10A9 9 0 1 0 21 13Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
function themeButton() {
  return `${icon(progress.theme === 'dark' ? 'sun' : 'moon')}<span>${t(progress.theme === 'dark' ? 'lightMode' : 'darkMode')}</span>`;
}
function save() {
  try { localStorage.setItem(key, JSON.stringify(progress)); }
  catch { storageAvailable = false; }
}
function navigate(next) { mode = next; hidden = mode === 'recall'; draft = ''; passed = false; finished = false; render(); }
function nextLabel() {
  return `${t(finished ? 'back' : 'next')}${mode !== 'recall' ? ' <kbd>Enter</kbd>' : ' →'}`;
}
function retryCurrent() {
  draft = ''; passed = false; finished = false; hidden = mode === 'recall';
  render(); document.querySelector('#answer').focus({ preventScroll: true });
}
function restartLesson() {
  if (mode === 'words') word = 0;
  else if (personal) customLine = 0;
  else progress.line = 0;
  save(); retryCurrent();
}
function render() {
  typingResizeObserver?.disconnect();
  const isLibrary = mode === 'library';
  const total = mode === 'words' ? vocabulary.length : activeLines().length;
  const completed = mode === 'words' ? progress.words.length : progress.completed.length;
  const percent = Math.round(completed / (mode === 'words' ? vocabulary.length : lines.length) * 100);
  document.documentElement.lang = progress.language;
  document.documentElement.dataset.theme = progress.theme;
  app.innerHTML = `<div class="layout">
    <aside class="sidebar">
      <div><div class="brand"><span class="logo">e</span>${t('brand')}</div><div class="tagline">${t('tagline')}</div></div>
      <div><div class="eyebrow">${t('workspace')}</div><nav class="nav">
        ${[['practice', 'writing'], ['words', 'vocabulary'], ['recall', 'memory'], ['library', 'library']].map(([id, label]) => `<button data-mode="${id}" aria-current="${mode === id ? 'page' : 'false'}" class="${mode === id ? 'active' : ''}">${icon(id)}${t(label)}</button>`).join('')}
      </nav></div>
      <footer><span class="status-dot"></span>${t('local')}</footer>
    </aside>
    <main class="main">
      <header class="topbar"><span>${t('studio')}</span><div class="topbar-controls"><button id="theme" class="theme-toggle">${themeButton()}</button><select id="language" aria-label="${t('languageLabel')}"><option value="vi">Tiếng Việt</option><option value="en">English</option><option value="zh-CN">简体中文</option></select></div></header>
      <section class="intro"><h1>${t(mode === 'words' ? 'vocabularyTitle' : mode === 'recall' ? 'memoryTitle' : 'heading')}</h1><p>${t(mode === 'words' ? 'vocabularySub' : mode === 'recall' ? 'memorySub' : 'subtitle')}</p></section>
      <section class="lesson">
        <div class="lesson-detail"><span class="lesson-icon">${icon('recall')}</span><div><div class="eyebrow">${t('lesson')}</div><h2>${personal ? t('customTitle') : t('prayer')}</h2><p>${personal ? t('source') : t('description')}</p></div></div>
        <div class="progress"><div class="progress-head"><span>${t('progress')}</span><strong>${personal ? '—' : `${percent}%`}</strong></div><div class="track"><div class="bar" id="progress-bar"></div></div><small>${personal ? `${activeLines().length} ${t('step').toLowerCase()}` : `${completed}/${mode === 'words' ? vocabulary.length : lines.length} ${t(mode === 'words' ? 'learnedWords' : 'mastered')}`}</small></div>
      </section>
      <section class="work ${isLibrary ? '' : 'practice-work'}">${isLibrary ? libraryView() : practiceView(total)}</section>
      <div class="below">${isLibrary ? '<span></span>' : `<button class="link review-link" id="restart">↻ ${t('restartLesson')}</button>`}<button class="secondary global-reset" id="reset">${t('resetAllPractice')}</button></div>
      <div class="note"><span class="note-icon">i</span><div><div class="eyebrow">${t('learning')}</div><p>${t('note')}</p></div></div>
      <p class="storage" role="status">${storageAvailable ? '' : t('storage')}</p>
    </main></div>`;
  document.querySelector('#language').value = progress.language;
  document.querySelector('#progress-bar').style.width = `${personal ? 0 : percent}%`;
  document.querySelector('#language').onchange = event => { progress.language = event.target.value; save(); render(); };
  document.querySelector('#theme').onclick = () => {
    progress.theme = progress.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = progress.theme;
    document.querySelector('#theme').innerHTML = themeButton();
    save();
  };
  const restart = document.querySelector('#restart');
  if (restart) restart.onclick = restartLesson;
  document.querySelectorAll('[data-mode]').forEach(button => button.onclick = () => { if (button.dataset.mode === 'words') personal = false; navigate(button.dataset.mode); });
  document.querySelector('#reset').onclick = () => {
    if (!confirm(t('confirmResetAll'))) return;
    progress = resetAllPractice(progress);
    word = 0; customLine = 0; personal = false; typingLevel = 'copy';
    save(); navigate('practice'); document.querySelector('#answer').focus({ preventScroll: true });
  };
  if (isLibrary) {
    document.querySelector('#custom').value = progress.custom;
    document.querySelector('#save').onclick = () => {
      const value = document.querySelector('#custom').value.trim();
      if (!value) { document.querySelector('#feedback').textContent = t('required'); return; }
      progress.custom = value; personal = true; customLine = 0; save(); navigate('practice');
    };
    document.querySelector('#original').onclick = () => { personal = false; navigate('practice'); };
    return;
  }
  const input = document.querySelector('#answer');
  input.value = draft;
  const onInput = () => {
    draft = input.value;
    passed = false;
    finished = false;
    document.querySelector('#next').disabled = true;
    document.querySelector('#next').innerHTML = nextLabel();
    const feedback = document.querySelector('#feedback');
    feedback.textContent = '';
    delete feedback.dataset.success;
    updateTyping();
    if (mode === 'practice') {
      if (!composing && ['copy', 'blind'].includes(typingLevel) && typingState(target(), draft, typingLevel).exact) {
        passed = true;
        recordPass();
        updateLessonProgress();
        feedback.textContent = t('good');
        feedback.dataset.success = 'true';
        document.querySelector('#next').disabled = false;
        document.querySelector('#typing-prompt').textContent = t('readyToContinue');
      }
    }
  };
  let composing = false;
  input.oncompositionstart = () => { composing = true; };
  input.oncompositionend = () => { composing = false; onInput(); };
  input.oninput = onInput;
  input.onkeydown = event => {
    if (event.key !== 'Enter') return;
    const action = enterAction({ mode, passed, ctrlKey: event.ctrlKey, shiftKey: event.shiftKey,
      altKey: event.altKey, metaKey: event.metaKey, composing: composing || event.isComposing, repeat: event.repeat });
    if (action === 'native') return;
    event.preventDefault();
    if (action === 'next') move(1);
    else if (action === 'check' || action === 'submit') {
      check();
      if (action === 'submit' && passed) move(1);
      document.querySelector('#answer').focus({ preventScroll: true });
    }
  };
  {
    input.onselect = updateTyping;
    input.onkeyup = updateTyping;
    input.onfocus = updateTyping;
    input.onblur = () => {
      const prompt = document.querySelector('#typing-prompt');
      if (prompt) prompt.textContent = t(finished && mode === 'recall' ? 'complete' : finished ? 'repeatReady' : passed ? 'readyToContinue' : 'typingFocus');
    };
    document.querySelector('#typing-surface').onclick = event => {
      const character = event.target.closest('[data-offset]');
      const position = character ? Math.min(Number(character.dataset.offset), draft.length) : draft.length;
      input.focus({ preventScroll: true });
      input.setSelectionRange(position, position);
      updateTyping();
    };
    document.querySelectorAll('[data-level]').forEach(button => button.onclick = () => {
      typingLevel = button.dataset.level;
      retryCurrent();
    });
    updateTyping();
    typingResizeObserver = new ResizeObserver(updateTypingTrack);
    typingResizeObserver.observe(document.querySelector('#typing-surface'));
  }
  document.querySelector('#check').onclick = check;
  const toggle = document.querySelector('#toggle');
  if (toggle) toggle.onclick = () => {
    hidden = !hidden;
    const sample = document.querySelector('.sample');
    sample.classList.toggle('hidden', hidden);
    sample.setAttribute('aria-hidden', String(hidden));
    toggle.textContent = t(hidden ? 'show' : 'hide');
    input.focus({ preventScroll: true });
  };
  const hint = document.querySelector('#hint');
  if (hint) hint.onclick = () => { const words = target().split(/\s+/); document.querySelector('#feedback').textContent = `${t('hintLabel')}: ${words.map(value => value[0] + '＿'.repeat(Math.min(value.length - 1, 6))).join(' ')}`; input.focus({ preventScroll: true }); };
  document.querySelector('#clear').onclick = retryCurrent;
  document.querySelector('#previous').onclick = () => move(-1);
  document.querySelector('#next').onclick = () => move(1);
  document.querySelectorAll('[data-word]').forEach(button => button.onclick = () => { word = Number(button.dataset.word); navigate('words'); });
}
function typingView() {
  const level = activeTypingLevel();
  return `${mode === 'practice' ? `<div class="typing-levels" role="group" aria-label="${t('levelLabel')}">
    ${[['copy', 'copyLevel'], ['hint', 'hintLevel'], ['self', 'selfLevel'], ['blind', 'blindLevel']].map(([level, label]) => `<button data-level="${level}" aria-pressed="${typingLevel === level}" class="${typingLevel === level ? 'active' : ''}">${t(label)}</button>`).join('')}
    </div>` : ''}<div class="typing-heading"><span class="eyebrow">${t('typingTitle')}</span><span id="typing-prompt">${t('typingStart')}</span></div>
    <div id="typing-surface" class="typing-surface">
      <label class="sr-only" for="answer">${t('write')} · ${t(`${level}Level`)}</label>
      <span id="typing-reference" class="sr-only">${escape(typingState(target(), '', level).characters.map(character => character.character).join(''))}</span>
      <textarea id="answer" class="typing-input" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="typing-tip typing-reference"></textarea>
      <div id="typing-display" class="typing-display" aria-hidden="true"></div>
    </div><div class="typing-summary">
      <div class="typing-legend"><span class="legend-pending">${t('pendingLabel')}</span><span class="legend-correct">${t('correctLabel')}</span><span class="legend-wrong">${t('wrongLabel')}</span></div>
      <div class="typing-metrics"><span id="typing-accuracy"></span><span id="typing-count"></span></div>
    </div>`;
}
function updateTyping() {
  const input = document.querySelector('#answer');
  const display = document.querySelector('#typing-display');
  if (!display) return;
  const level = activeTypingLevel();
  const state = typingState(target(), draft, level, input.selectionStart, input.selectionEnd, input.selectionDirection);
  const characters = state.endCursor ? [...state.characters, { character: '\u200b', status: 'end-cursor', offset: draft.length, cursor: true }] : state.characters;
  const activeIndex = characters.findIndex(character => character.cursor);
  while (display.children.length > characters.length) display.lastElementChild.remove();
  characters.forEach((character, i) => {
    const focusLetter = ['self', 'blind'].includes(level) && state.endCursor && i === activeIndex - 1;
    const status = passed && character.status === 'entered' ? 'correct' : character.status;
    const wrong = character.status === 'wrong' || character.status === 'extra';
    const visible = character.character.includes('\n') ? '↵' : (wrong || character.cursor || focusLetter) && /\s/u.test(character.character) ? '␣' : character.character;
    let letter = display.children[i];
    if (!letter) { letter = document.createElement('span'); display.append(letter); }
    if (letter.textContent !== visible) letter.textContent = visible;
    letter.dataset.offset = String(character.offset);
    const classes = `typing-char ${status}${character.cursor ? ' cursor' : ''}${focusLetter ? ' focus-letter' : ''}${i === activeIndex + 1 ? ' upcoming' : ''}${character.selected ? ' selected' : ''}`;
    if (letter.className !== classes) letter.className = classes;
    letter.title = character.character.includes('\n') ? t('lineBreak') : wrong && level !== 'blind' ? `${t('expectedLabel')}: ${character.expected || '∅'}` : '';
  });
  updateTypingTrack();
  document.querySelector('#typing-count').textContent = `${state.typed}${level === 'blind' ? '' : ` / ${state.total}`} ${t('characters')}`;
  document.querySelector('#typing-accuracy').textContent = ['copy', 'blind'].includes(level) ? `${t('liveAccuracy')}: ${state.typed ? `${state.liveAccuracy}%` : '—'}` : '';
  document.querySelector('.typing-legend').hidden = !['copy', 'blind'].includes(level);
  document.querySelector('.legend-pending').hidden = level === 'blind';
  document.querySelector('#typing-prompt').textContent = t(finished && mode === 'recall' ? 'complete' : finished ? 'repeatReady' : passed ? 'readyToContinue' : draft ? 'typingActive' : 'typingStart');
}
function updateTypingTrack() {
  const surface = document.querySelector('#typing-surface');
  const display = document.querySelector('#typing-display');
  const current = display?.querySelector('.cursor');
  if (!surface || !current) return;
  const offset = typingTrackOffset(surface.clientWidth, current.offsetLeft, current.offsetWidth);
  display.style.transform = `translateX(${offset}px)`;
}
function recordPass() {
  if (personal) return;
  if (mode === 'words') progress.words = [...new Set([...progress.words, word])];
  else if (mode === 'recall') progress.completed = lines.map((_, i) => i);
  else progress.completed = [...new Set([...progress.completed, progress.line])];
  save();
}
function updateLessonProgress() {
  if (personal) return;
  const percent = Math.round(progress.completed.length / lines.length * 100);
  document.querySelector('.progress strong').textContent = `${percent}%`;
  document.querySelector('#progress-bar').style.width = `${percent}%`;
  document.querySelector('.progress small').textContent = `${progress.completed.length}/${lines.length} ${t('mastered')}`;
  document.querySelectorAll('.dots i').forEach((dot, i) => dot.classList.toggle('done', progress.completed.includes(i)));
  document.querySelector('.storage').textContent = storageAvailable ? '' : t('storage');
}
function libraryView() {
  return `<h2 class="page-title">${t('libraryTitle')}</h2><p class="page-sub">${t('librarySub')}</p><label class="eyebrow input-label" for="custom">${t('custom')}</label><textarea class="large" id="custom" maxlength="10000"></textarea><div class="actions"><button id="original" class="secondary">Our Father</button><button id="save" class="primary">${t('save')}</button></div><div id="feedback" role="status"></div>`;
}
function practiceView(total) {
  const vocab = mode === 'words';
  const recall = mode === 'recall';
  const englishMeanings = ['the home of God', 'made holy', 'a realm ruled by a king', 'the world we live on', 'food needed each day', 'to pardon someone', 'wrong acts or sins', 'a desire to do something wrong', 'to rescue or set free', 'something morally wrong'];
  const meaning = progress.language === 'zh-CN' ? vocabulary[word][2] : progress.language === 'en' ? englishMeanings[word] : vocabulary[word][1];
  const editor = `${mode === 'practice' ? '' : `<div class="review-context"><div class="label-row"><span class="eyebrow">${t(vocab ? 'meaning' : 'reference')}</span>${vocab ? '' : `<button class="link" id="toggle">${t(hidden ? 'show' : 'hide')}</button>`}</div><p class="sample ${hidden && !vocab ? 'hidden' : ''}" ${hidden && !vocab ? 'aria-hidden="true"' : ''}>${escape(vocab ? meaning : target())}</p></div>`}${typingView()}`;
  return `${vocab ? `<div class="vocab-list">${vocabulary.map((item, i) => `<button data-word="${i}" class="${word === i ? 'active' : ''}">${i + 1}${progress.words.includes(i) ? ' ✓' : ''}</button>`).join('')}</div>` : ''}
    <div class="work-head"><span class="eyebrow">${recall ? `${t('recall')} · ${total} ${t('step').toLowerCase()}` : `${t(vocab ? 'words' : 'step')} ${String(index() + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}</span><div class="dots">${Array.from({ length: Math.min(total, 30) }, (_, i) => `<i class="${i === index() ? 'current' : ''} ${!personal && progress.completed.includes(i) && !vocab ? 'done' : ''}"></i>`).join('')}</div></div>
    ${editor}
    <div class="actions typing-actions"><div><button id="previous" class="link" ${index() === 0 || recall ? 'disabled' : ''}>← ${t('previous')}</button> ${mode === 'practice' && ['copy', 'blind'].includes(typingLevel) ? '' : `<button id="hint" class="secondary">${t('hint')}</button>`} <button id="clear" class="link review-link">↻ ${t(mode === 'practice' ? 'retryLine' : mode === 'words' ? 'retryWord' : 'back')}</button></div><div><button id="check" class="secondary">${t('check')} <kbd>Ctrl ↵</kbd></button><button id="next" class="primary" ${passed ? '' : 'disabled'}>${nextLabel()}</button></div></div>
    <div class="practice-help"><p class="tip" id="typing-tip">${t(mode === 'practice' ? `${typingLevel}Tip` : 'tip')}</p><p class="shortcut-tip">${t(mode === 'recall' ? 'multilineTip' : 'keyboardTip')}</p></div>
    <div id="feedback" class="feedback" role="status" aria-live="polite"></div>
    `;
}
function check() {
  let feedback = document.querySelector('#feedback');
  if (!draft.trim()) { feedback.textContent = t('empty'); document.querySelector('#answer').focus({ preventScroll: true }); return; }
  const result = mode === 'practice' && ['copy', 'blind'].includes(typingLevel) ? typingState(target(), draft, typingLevel) : compare(target(), draft);
  passed = result.exact;
  finished = mode === 'recall' && passed;
  if (passed) recordPass();
  render();
  feedback = document.querySelector('#feedback');
  feedback.dataset.success = String(passed);
  feedback.textContent = `${t('accuracy')}: ${result.accuracy}% · ${t(passed ? 'good' : mode === 'practice' && typingLevel === 'blind' ? 'blindRetry' : 'retry')}${passed || mode === 'practice' && typingLevel === 'blind' ? '' : `\n${target()}`}`;
  document.querySelector('#next').disabled = !passed;
  document.querySelector('#answer').focus({ preventScroll: true });
}
function move(delta) {
  if (delta > 0 && finished) { restartLesson(); return; }
  const length = mode === 'words' ? vocabulary.length : activeLines().length;
  if (mode === 'recall' || index() + delta >= length) {
    finished = true;
    render();
    document.querySelector('#feedback').textContent = t('complete');
    document.querySelector('#feedback').dataset.success = 'true';
    document.querySelector('#answer').focus({ preventScroll: true });
    return;
  }
  if (mode === 'words') word = Math.max(0, word + delta);
  else if (personal) customLine = Math.max(0, customLine + delta);
  else progress.line = Math.max(0, progress.line + delta);
  save(); draft = ''; passed = false; finished = false; render(); document.querySelector('#answer').focus({ preventScroll: true });
}
render();
document.fonts.ready.then(updateTypingTrack);
document.fonts.addEventListener('loadingdone', updateTypingTrack);

const { app, BrowserWindow } = require('electron');
const path = require('node:path');
app.setName('English Typing');
app.setPath('userData', path.join(app.getPath('appData'), process.argv.includes('--smoke') ? 'EnglishTyping-Smoke' : 'EnglishTyping'));
function openWindow() {
  const window = new BrowserWindow({ width: 1320, height: 900, minWidth: 880, minHeight: 680, backgroundColor: '#10151e', autoHideMenuBar: true, webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true } });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.loadFile(path.join(__dirname, '../renderer/index.html'));
  if (process.argv.includes('--smoke')) {
    window.webContents.setBackgroundThrottling(false);
    window.webContents.on('did-finish-load', async () => {
      try {
        window.focus();
        window.webContents.focus();
        await window.webContents.executeJavaScript(`document.fonts.ready`);
        const result = await window.webContents.executeJavaScript(`(async () => {
          localStorage.removeItem('english-typing.progress.v1');
          function type(text) { const input = document.querySelector('#answer'); input.value = text; input.setSelectionRange(text.length, text.length); input.dispatchEvent(new Event('input')); }
          function enter(text) { type(text); document.querySelector('#check').click(); return document.querySelector('#feedback').dataset.success === 'true'; }
          const pending = document.querySelectorAll('.typing-char.pending').length === 'Our Father, who art in heaven,'.length;
          type('Ox');
          const errors = document.querySelectorAll('.typing-char.correct').length === 1 && document.querySelectorAll('.typing-char.wrong').length === 1;
          type('Ou');
          const correction = !document.querySelector('.typing-char.wrong') && document.querySelectorAll('.typing-char.correct').length === 2;
          const input = document.querySelector('#answer'); input.setSelectionRange(1, 1); input.dispatchEvent(new Event('select'));
          const cursor = document.querySelector('.typing-char.cursor').dataset.offset === '1';
          const strict = !enter('our father who art in heaven');
          type('Our Father, who art in heaven,');
          const writing = !document.querySelector('#next').disabled && document.querySelector('#feedback').dataset.success === 'true' && document.querySelector('.progress strong').textContent === '9%';
          document.querySelector('#next').click();
          const nextLine = document.querySelector('#typing-display').textContent === 'hallowed be Thy name;';
          document.querySelector('#previous').click();
          document.querySelector('[data-level="hint"]').click();
          const hint = document.querySelector('#typing-display').textContent.includes('O·· F·····,') && !document.querySelector('.typing-char.correct');
          const flexible = enter('our father who art in heaven');
          document.querySelector('[data-level="self"]').click();
          const hidden = document.querySelector('#typing-display').textContent.trim().replace(/\\u200b/g, '') === '';
          const self = enter('our father who art in heaven');
          document.querySelector('[data-mode="words"]').click();
          const vocabulary = enter('heaven');
          document.querySelector('[data-mode="recall"]').click();
          const recall = Boolean(document.querySelector('.sample.hidden'));
          document.querySelector('[data-mode="library"]').click();
          document.querySelector('#custom').value = 'Hello world.\\nI learn English.';
          document.querySelector('#save').click();
          document.querySelector('[data-level="hint"]').click();
          const custom = enter('hello world');
          document.querySelector('#next').click();
          document.querySelector('[data-level="copy"]').click();
          const next = document.querySelector('#typing-display').textContent === 'I learn English.';
          document.querySelector('[data-mode="library"]').click(); document.querySelector('#original').click();
          const saved = JSON.parse(localStorage.getItem('english-typing.progress.v1'));
          localStorage.removeItem('english-typing.progress.v1');
          await new Promise(resolve => requestAnimationFrame(resolve));
          type('Our Fathx'); document.querySelector('#answer').focus();
          return { passed: pending && errors && correction && cursor && strict && writing && nextLine && hint && flexible && hidden && self && vocabulary && recall && custom && next && saved.words.includes(0), pending, errors, correction, cursor, strict, writing, nextLine, hint, flexible, hidden, self, vocabulary, recall, custom, next };
        })()`);
        window.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Backspace' });
        window.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Backspace' });
        result.nativeBackspace = await window.webContents.executeJavaScript(`document.querySelector('#answer').value === 'Our Fath' && !document.querySelector('.typing-char.wrong')`);
        await window.webContents.insertText('er');
        result.nativeTyping = await window.webContents.executeJavaScript(`document.querySelector('#answer').value === 'Our Father' && document.querySelectorAll('.typing-char.correct').length === 10`);
        window.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Left' });
        window.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Left' });
        result.nativeCursor = await window.webContents.executeJavaScript(`new Promise(resolve => requestAnimationFrame(() => resolve(document.querySelector('.typing-char.cursor').dataset.offset === '9')))`);
        const pressEnter = modifiers => {
          window.webContents.sendInputEvent({ type: 'keyDown', keyCode: 'Return', modifiers });
          if (!modifiers.length) window.webContents.sendInputEvent({ type: 'char', keyCode: '\r' });
          window.webContents.sendInputEvent({ type: 'keyUp', keyCode: 'Return', modifiers });
        };
        await window.webContents.executeJavaScript(`const answer = document.querySelector('#answer'); answer.value = 'Our Father, who art in heaven,'; answer.dispatchEvent(new Event('input')); answer.focus();`);
        pressEnter([]);
        result.enterNext = await window.webContents.executeJavaScript(`document.querySelector('#typing-display').textContent === 'hallowed be Thy name;' && document.activeElement.id === 'answer' && document.querySelector('#answer').value === ''`);
        await window.webContents.insertText('wrong');
        pressEnter([]);
        result.enterError = await window.webContents.executeJavaScript(`document.querySelector('#answer').value === 'wrong' && document.querySelector('#feedback').dataset.success === 'false' && document.activeElement.id === 'answer'`);
        await window.webContents.executeJavaScript(`document.querySelector('#answer').value = 'hallowed be Thy name;'; document.querySelector('#answer').dispatchEvent(new Event('input'));`);
        pressEnter(['control']);
        result.controlCheck = await window.webContents.executeJavaScript(`document.querySelector('#answer').value === 'hallowed be Thy name;' && document.querySelector('#feedback').dataset.success === 'true' && document.activeElement.id === 'answer'`);
        pressEnter([]);
        await window.webContents.executeJavaScript(`document.querySelector('[data-level="hint"]').click();`);
        await window.webContents.insertText('thy kingdom come');
        pressEnter([]);
        result.enterHint = await window.webContents.executeJavaScript(`document.querySelector('.work-head .eyebrow').textContent.includes('04') && document.querySelector('#answer').value === '' && document.activeElement.id === 'answer'`);
        await window.webContents.executeJavaScript(`document.querySelector('[data-mode="recall"]').click(); document.querySelector('#answer').focus();`);
        await window.webContents.insertText('one');
        pressEnter([]);
        result.paragraphNewline = await window.webContents.executeJavaScript(`new Promise(resolve => requestAnimationFrame(() => resolve(document.querySelector('#answer').value === 'one\\n')))`);
        const reviewChecks = await window.webContents.executeJavaScript(`(() => {
          const recallInput = document.querySelector('#answer'); const selection = recallInput.selectionStart;
          const reviewInput = recallInput.classList.contains('typing-input') && document.querySelector('#typing-display').textContent.includes('↵') && Boolean(document.querySelector('.focus-letter'));
          document.querySelector('#toggle').click();
          const referenceToggle = document.querySelector('#answer') === recallInput && recallInput.value === 'one\\n' && recallInput.selectionStart === selection && !document.querySelector('.sample').classList.contains('hidden');
          const reference = document.querySelector('.sample').textContent;
          document.querySelector('#toggle').click();
          const recallHidden = getComputedStyle(document.querySelector('.sample')).display === 'none' && document.querySelector('#typing-reference').textContent === '';
          recallInput.value = reference.toLowerCase().replace(/[.,;]/g, ''); recallInput.dispatchEvent(new Event('input'));
          const noAnswerLeak = !document.querySelector('.typing-char.correct') && !document.querySelector('.typing-char.wrong');
          document.querySelector('#check').click();
          const recallFlexible = document.querySelector('#feedback').dataset.success === 'true' && document.querySelectorAll('.typing-char.correct').length > 0;
          document.querySelector('[data-mode="words"]').click();
          const wordInput = document.querySelector('#answer'); wordInput.value = 'heaven'; wordInput.dispatchEvent(new Event('input'));
          const wordSharedInput = wordInput.classList.contains('typing-input') && Boolean(document.querySelector('.focus-letter')) && document.querySelector('#typing-reference').textContent === '';
          document.querySelector('#check').click();
          const wordGlow = document.querySelector('#feedback').dataset.success === 'true' && document.querySelectorAll('.typing-char.correct').length === 6;
          return { reviewInput, referenceToggle, recallHidden, noAnswerLeak, recallFlexible, wordSharedInput, wordGlow };
        })()`);
        Object.assign(result, reviewChecks);
        await window.webContents.executeJavaScript(`(async () => { document.querySelector('#answer').blur(); scrollTo(0, 0); await Promise.all(document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()`);
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview-vocabulary.png'), image.toPNG()));
        await window.webContents.executeJavaScript(`(async () => { document.querySelector('[data-mode="recall"]').click(); const reviewAnswer = document.querySelector('#answer'); reviewAnswer.value = 'Our Father, who art in heaven,\\nhallowed be Thy'; reviewAnswer.dispatchEvent(new Event('input')); reviewAnswer.blur(); scrollTo(0, 0); await Promise.all(document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()`);
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview-recall.png'), image.toPNG()));
        const blindChecks = await window.webContents.executeJavaScript(`(() => {
          document.querySelector('[data-mode="practice"]').click(); document.querySelector('#restart').click();
          document.querySelector('[data-level="blind"]').click();
          const blindHidden = document.querySelector('#typing-reference').textContent === '' && !document.querySelector('.typing-char.pending') && !document.querySelector('#hint') && document.querySelector('#typing-display').textContent === '\\u200b';
          const typeBlind = value => { const input = document.querySelector('#answer'); input.value = value; input.dispatchEvent(new Event('input')); };
          typeBlind('OUR, fathxr');
          const blindColors = document.querySelectorAll('.typing-char.correct').length > 0 && document.querySelectorAll('.typing-char.wrong').length === 1 && document.querySelector('#next').disabled && !document.querySelector('.typing-char[title]:not([title=""])');
          document.querySelector('#check').click();
          const blindNoLeak = !document.querySelector('#feedback').textContent.includes('who art') && document.querySelector('#typing-reference').textContent === '' && document.querySelector('#feedback').dataset.success === 'false';
          typeBlind('ourfather who art in heaven');
          const blindSpaces = document.querySelector('#next').disabled;
          typeBlind('our father who art in heaven');
          const blindPass = !document.querySelector('#next').disabled && !document.querySelector('.typing-char.wrong');
          document.querySelector('#answer').dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
          const blindNext = document.querySelector('.work-head .eyebrow').textContent.includes('02') && document.querySelector('#answer').value === '' && document.querySelector('[data-level="blind"]').getAttribute('aria-pressed') === 'true' && document.activeElement.id === 'answer';
          typeBlind('hallowxd be thy');
          return { blindHidden, blindColors, blindNoLeak, blindSpaces, blindPass, blindNext };
        })()`);
        Object.assign(result, blindChecks);
        await window.webContents.executeJavaScript(`(async () => { await Promise.all(document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()`);
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview-blind.png'), image.toPNG()));
        result.passed = result.passed && Object.values(blindChecks).every(Boolean);
        const repeatChecks = await window.webContents.executeJavaScript(`(() => {
          document.querySelector('[data-mode="practice"]').click();
          document.querySelector('[data-level="copy"]').click();
          const originalLine = document.querySelector('#typing-display').textContent;
          const retryInput = document.querySelector('#answer'); retryInput.value = originalLine; retryInput.dispatchEvent(new Event('input'));
          const remembered = JSON.parse(localStorage.getItem('english-typing.progress.v1')).completed;
          document.querySelector('#clear').click();
          const retrySentence = document.querySelector('#answer').value === '' && document.querySelector('#typing-display').textContent === originalLine && document.querySelector('#next').disabled && document.activeElement.id === 'answer';
          document.querySelector('#restart').click();
          const reviewFromStart = document.querySelector('#typing-display').textContent === 'Our Father, who art in heaven,' && JSON.stringify(JSON.parse(localStorage.getItem('english-typing.progress.v1')).completed) === JSON.stringify(remembered);
          document.querySelector('[data-mode="library"]').click(); document.querySelector('#custom').value = 'One.'; document.querySelector('#save').click();
          const lastInput = document.querySelector('#answer'); lastInput.value = 'One.'; lastInput.dispatchEvent(new Event('input')); document.querySelector('#next').click();
          const repeatAtEnd = !document.querySelector('#next').disabled && document.querySelector('#next').textContent.includes('Enter');
          document.querySelector('#next').click();
          const repeatedLesson = document.querySelector('#answer').value === '' && document.querySelector('#typing-display').textContent === 'One.' && document.querySelector('#next').disabled && document.activeElement.id === 'answer';
          document.querySelector('[data-mode="library"]').click(); document.querySelector('#original').click();
          return { retrySentence, reviewFromStart, repeatAtEnd, repeatedLesson };
        })()`);
        Object.assign(result, repeatChecks);
        const resetChecks = await window.webContents.executeJavaScript(`(() => {
          document.querySelector('[data-mode="words"]').click(); document.querySelector('[data-word="4"]').click();
          const wordInput = document.querySelector('#answer'); wordInput.value = 'daily bread'; wordInput.dispatchEvent(new Event('input')); document.querySelector('#check').click();
          document.querySelector('[data-mode="library"]').click(); document.querySelector('#custom').value = 'Saved passage.\\nSecond line.'; document.querySelector('#save').click();
          document.querySelector('[data-level="self"]').click();
          const customInput = document.querySelector('#answer'); customInput.value = 'Saved passage.'; customInput.dispatchEvent(new Event('input')); document.querySelector('#check').click(); document.querySelector('#next').click();
          const before = JSON.parse(localStorage.getItem('english-typing.progress.v1')); const originalConfirm = window.confirm;
          window.confirm = () => false; document.querySelector('#reset').click();
          const resetCancelled = JSON.stringify(JSON.parse(localStorage.getItem('english-typing.progress.v1'))) === JSON.stringify(before) && document.querySelector('[data-level="self"]').getAttribute('aria-pressed') === 'true';
          window.confirm = () => true; document.querySelector('#reset').click(); window.confirm = originalConfirm;
          const after = JSON.parse(localStorage.getItem('english-typing.progress.v1'));
          const resetAll = before.words.includes(4) && before.completed.length > 0 && after.line === 0 && after.completed.length === 0 && after.words.length === 0 && after.custom === before.custom && after.language === before.language && after.theme === before.theme && document.querySelector('#answer').value === '' && document.querySelector('[data-level="copy"]').getAttribute('aria-pressed') === 'true' && document.querySelector('.lesson h2').textContent === 'Our Father';
          document.querySelector('[data-mode="words"]').click(); const resetWords = document.querySelector('[data-word="0"]').classList.contains('active'); document.querySelector('[data-mode="practice"]').click();
          return { resetAll, resetCancelled, resetWords };
        })()`);
        Object.assign(result, resetChecks);
        await window.webContents.executeJavaScript(`document.querySelector('[data-mode="practice"]').click(); for(let i = 0; i < 3; i++) document.querySelector('#previous').click(); document.querySelector('[data-level="copy"]').click(); document.querySelector('#language').value = 'en'; document.querySelector('#language').dispatchEvent(new Event('change')); const previewInput = document.querySelector('#answer'); previewInput.value = 'Our Father, who art in heaven,'; previewInput.dispatchEvent(new Event('input')); previewInput.focus(); localStorage.removeItem('english-typing.progress.v1');`);
        window.focus();
        window.webContents.focus();
        await window.webContents.executeJavaScript(`const sliderInput = document.querySelector('#answer'); sliderInput.value = 'Our Father, who '; sliderInput.setSelectionRange(sliderInput.value.length, sliderInput.value.length); sliderInput.dispatchEvent(new Event('input'));`);
        result.roboto = await window.webContents.executeJavaScript(`(async () => { const faces = await document.fonts.load('500 36px Roboto'); return faces.some(face => face.status === 'loaded') && getComputedStyle(document.querySelector('#typing-display')).fontFamily.includes('Roboto'); })()`);
        result.theme = await window.webContents.executeJavaScript(`(() => { const draft = document.querySelector('#answer').value; document.querySelector('#theme').click(); const light = document.documentElement.dataset.theme === 'light' && JSON.parse(localStorage.getItem('english-typing.progress.v1')).theme === 'light'; document.querySelector('#theme').click(); const dark = document.documentElement.dataset.theme === 'dark' && JSON.parse(localStorage.getItem('english-typing.progress.v1')).theme === 'dark'; localStorage.removeItem('english-typing.progress.v1'); return light && dark && document.querySelector('#answer').value === draft; })()`);
        const sliderChecks = await window.webContents.executeJavaScript(`new Promise(resolve => {
          let frames = 0;
          function inspect() {
            const surface = document.querySelector('#typing-surface'); const current = document.querySelector('.typing-char.cursor');
            const bounds = surface.getBoundingClientRect(); const glyph = current.getBoundingClientRect();
            const zoom = new DOMMatrixReadOnly(getComputedStyle(current).transform).a;
            const sliding = Math.abs(glyph.left + glyph.width / 2 - bounds.left - bounds.width * .32) < 2;
            const correct = getComputedStyle(document.querySelector('.typing-char.correct'));
            const green = correct.color === 'rgb(74, 222, 128)';
            if (sliding && zoom >= 1.21 && green || ++frames > 90) {
              resolve({ sliding, zoom: zoom >= 1.21 && zoom < 1.3, green, glow: correct.textShadow !== 'none', frameless: getComputedStyle(surface).borderTopWidth === '0px' && getComputedStyle(document.querySelector('.work')).backgroundColor === 'rgba(0, 0, 0, 0)' });
            } else requestAnimationFrame(inspect);
          }
          requestAnimationFrame(inspect);
        })`);
        Object.assign(result, sliderChecks);
        result.passed = result.passed && result.nativeBackspace && result.nativeTyping && result.nativeCursor && result.enterNext && result.enterError && result.controlCheck && result.enterHint && result.paragraphNewline && result.retrySentence && result.reviewFromStart && result.repeatAtEnd && result.repeatedLesson && result.green && result.glow && result.frameless && result.sliding && result.zoom && result.resetAll && result.resetCancelled && result.resetWords && result.roboto && result.theme && Object.values(reviewChecks).every(Boolean);
        console.log(JSON.stringify(result));
        await window.webContents.executeJavaScript(`(async () => { document.querySelector('#answer').blur(); scrollTo(0, 0); await Promise.all(document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()`);
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview.png'), image.toPNG()));
        await window.webContents.executeJavaScript(`(async () => { document.querySelector('#theme').click(); await Promise.all(document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity).map(animation => animation.finished.catch(() => {}))); await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))); })()`);
        const lightContrast = await window.webContents.executeJavaScript(`getComputedStyle(document.querySelector('.nav button:not(.active)')).color === 'rgb(71, 85, 105)' && getComputedStyle(document.querySelector('.typing-char.correct')).color === 'rgb(21, 128, 61)'`);
        if (!lightContrast) throw new Error('Light mode did not settle to readable colors');
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview-light.png'), image.toPNG()));
        await window.webContents.executeJavaScript(`document.querySelector('#theme').click(); localStorage.removeItem('english-typing.progress.v1');`);
        window.setSize(880, 680);
        await window.webContents.executeJavaScript(`new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))`);
        const narrowLayout = await window.webContents.executeJavaScript(`new Promise(resolve => {
          let frames = 0;
          function inspectNarrow() {
            const surface = document.querySelector('#typing-surface').getBoundingClientRect();
            const glyph = document.querySelector('.typing-char.cursor').getBoundingClientRect();
            const aligned = Math.abs(glyph.left + glyph.width / 2 - surface.left - surface.width * .32) < 2;
            const fits = document.documentElement.scrollWidth <= innerWidth && document.querySelector('#next').getBoundingClientRect().right <= innerWidth;
            if (aligned && fits || ++frames > 90) resolve(aligned && fits); else requestAnimationFrame(inspectNarrow);
          }
          requestAnimationFrame(inspectNarrow);
        })`);
        await window.webContents.capturePage().then(image => require('node:fs').writeFileSync(path.join(app.getPath('userData'), 'preview-narrow.png'), image.toPNG()));
        if (!narrowLayout) throw new Error('Narrow layout overflows the window');
        app.exit(result.passed ? 0 : 1);
      } catch (error) { console.error(error); app.exit(1); }
    });
  }
}
app.whenReady().then(() => { openWindow(); app.on('activate', () => { if (!BrowserWindow.getAllWindows().length) openWindow(); }); });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

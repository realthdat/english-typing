export const lines = [
  'Our Father, who art in heaven,',
  'hallowed be Thy name;',
  'Thy kingdom come,',
  'Thy will be done',
  'on earth as it is in heaven.',
  'Give us this day our daily bread,',
  'and forgive us our trespasses',
  'as we forgive those who trespass against us;',
  'and lead us not into temptation,',
  'but deliver us from evil.',
  'Amen.'
];
export const vocabulary = [
  ['heaven', 'thiên đàng', '天国'], ['hallowed', 'được tôn thánh', '被尊为圣'],
  ['kingdom', 'vương quốc', '国度'], ['earth', 'trái đất', '大地'],
  ['daily bread', 'lương thực hằng ngày', '每日的食粮'], ['forgive', 'tha thứ', '原谅'],
  ['trespasses', 'những lỗi lầm', '过犯'], ['temptation', 'sự cám dỗ', '诱惑'],
  ['deliver', 'cứu thoát', '拯救'], ['evil', 'điều ác', '邪恶']
];
export function normalize(value) { return value.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9'\s]/g, '').trim().replace(/\s+/g, ' '); }
export function compare(expected, actual) {
  const a = normalize(expected).split(' ').filter(Boolean);
  const b = normalize(actual).split(' ').filter(Boolean);
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + Number(a[i - 1] !== b[j - 1]));
  return { exact: normalize(expected) === normalize(actual), accuracy: Math.round(Math.max(0, 1 - rows[a.length][b.length] / Math.max(a.length, b.length, 1)) * 100) };
}
export function normalizeProgress(value) {
  const source = value && typeof value === 'object' ? value : {};
  return {
    line: Number.isInteger(source.line) && source.line >= 0 && source.line < lines.length ? source.line : 0,
    completed: Array.isArray(source.completed) ? [...new Set(source.completed.filter(n => Number.isInteger(n) && n >= 0 && n < lines.length))] : [],
    words: Array.isArray(source.words) ? [...new Set(source.words.filter(n => Number.isInteger(n) && n >= 0 && n < vocabulary.length))] : [],
    custom: typeof source.custom === 'string' ? source.custom.slice(0, 10000) : '',
    language: ['vi', 'en', 'zh-CN'].includes(source.language) ? source.language : 'vi',
    theme: source.theme === 'light' ? 'light' : 'dark'
  };
}

/** Resets all learning progress while retaining the user's passage and preferences. */
export function resetAllPractice(value) {
  return { ...normalizeProgress(value), line: 0, completed: [], words: [] };
}

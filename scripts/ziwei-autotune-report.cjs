const path = require('path');
const fs = require('fs');
const vm = require('vm');

const { Solar, Lunar } = require('lunar-javascript');
global.Solar = Solar;
global.Lunar = Lunar;

const dummyEl = () => ({
  style: {},
  dataset: {},
  classList: { add() {}, remove() {}, contains() { return false; } },
  appendChild() {},
  removeChild() {},
  setAttribute() {},
  getAttribute() { return null; },
  addEventListener() {},
  removeEventListener() {},
  querySelector() { return null; },
  querySelectorAll() { return []; },
  focus() {},
  blur() {},
  click() {},
  innerHTML: '',
  textContent: '',
  value: '',
  checked: false,
  options: [{
    text: '대한민국 · 서울',
    value: 'Asia/Seoul',
    getAttribute(name) {
      if (name === 'data-long') return '126.978';
      if (name === 'data-lat') return '37.5665';
      if (name === 'data-base-tz' || name === 'data-tz') return '9';
      return '';
    },
  }],
  selectedIndex: 0,
});

const elementCache = new Map();
const getEl = (id) => {
  if (!elementCache.has(id)) elementCache.set(id, dummyEl());
  return elementCache.get(id);
};

global.window = global;
global.navigator = { userAgent: 'node' };
global.location = { href: '' };
global.localStorage = {
  _s: {},
  getItem(k) { return this._s[k] || null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; },
};
global.sessionStorage = {
  _s: {},
  getItem(k) { return this._s[k] || null; },
  setItem(k, v) { this._s[k] = String(v); },
  removeItem(k) { delete this._s[k]; },
};
global.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
global.alert = () => {};
global.confirm = () => true;
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);
global.document = {
  head: { appendChild() {}, removeChild() {} },
  body: { appendChild() {}, removeChild() {} },
  documentElement: { style: {} },
  getElementById(id) { return getEl(id); },
  getElementsByName() { return []; },
  querySelector() { return null; },
  querySelectorAll() { return []; },
  createElement() { return dummyEl(); },
  addEventListener() {},
  removeEventListener() {},
};
global.window.addEventListener = () => {};
global.window.removeEventListener = () => {};
global.window.scrollTo = () => {};

const enginePath = path.resolve(__dirname, '..', 'js', 'saju-engine.js');
const engineCode = fs.readFileSync(enginePath, 'utf8');
vm.runInThisContext(engineCode, { filename: enginePath });

if (typeof global.renderZiwei === 'function') {
  global._ziweiBirth = { year: 2000, month: 1, day: 1, hour: 12, minute: 0 };
  global.renderZiwei({}, {}, 'zwNodeTarget');
}

function caseKey(inp) {
  if (!inp) return '';
  return [Number(inp.year) || 0, Number(inp.month) || 0, Number(inp.day) || 0, Number(inp.hour) || 0, Number(inp.minute) || 0].join('-');
}

const provided = global.debugZiweiProvidedCases();
const defaults = global.debugZiweiExpectedCasesDefault();
const byKey = {};
(defaults || []).forEach((c) => { byKey[caseKey(c && c.input)] = c; });

const palaceAlias = {
  '자기자신': '명궁',
  '형제친구': '형제궁',
  '애정부부': '부부궁',
  '자녀후배': '자녀궁',
  '금전수익': '재백궁',
  '신체건강': '질액궁',
  '사회활동': '천이궁',
  '인간관계': '노복궁',
  '직업성공': '관록궁',
  '주거환경': '전택궁',
  '정신행복': '복덕궁',
  '부모손배': '부모궁',
  '부모선비': '부모궁',
};

function normalizeExpectedPalaceName(name) {
  const src = String(name || '').trim();
  return palaceAlias[src] || src;
}

const expectedC1toC6 = (provided || []).map((c) => {
  const k = caseKey(c && c.input);
  if (byKey[k]) {
    const matched = byKey[k];
    return {
      label: matched.label,
      input: matched.input,
      rows: (matched.rows || []).map((r) => ({
        palace: normalizeExpectedPalaceName(r.palace),
        branch: r.branch,
        main: r.main,
        aux: r.aux,
        bad: r.bad,
      })),
    };
  }
  return {
    label: c.label,
    input: c.input,
    rows: (c.rows || []).map((r) => ({
      palace: r.palace,
      branch: r.branch,
      main: r.main,
      aux: r.aux,
      bad: r.bad,
    })),
  };
});

const beforeDiff = global.debugZiweiCompareBrightness(expectedC1toC6);
const beforeMismatch = (beforeDiff || []).reduce((s, c) => s + (c.totalMismatches || 0), 0);

const tuneResult = global.debugZiweiAutoTuneBrightness(expectedC1toC6, {
  maxIter: 40,
  step: 0.03,
  minStep: 0.0015,
  tuneStarBias: true,
  tuneBranchBias: true,
  tuneInteractionBias: true,
});

const afterDiff = (tuneResult && tuneResult.diff) || [];
const report = {
  meta: {
    expectedCaseCount: expectedC1toC6.length,
    beforeMismatch,
    afterMismatch: tuneResult.totalMismatch,
    afterLoss: tuneResult.loss,
  },
  cases: afterDiff.map((c) => ({
    label: c.label,
    totalMismatches: c.totalMismatches || 0,
    mismatches: (c.mismatches || []).slice(0, 20),
  })),
  historyTail: (tuneResult.history || []).slice(-12),
};

const outPath = path.resolve(__dirname, '..', 'ziwei_autotune_report.utf8.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log('wrote report:', outPath);
process.exit(0);

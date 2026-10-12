export function autoIndent(el) {
  const start = el.selectionStart;
  const lineStart = el.value.lastIndexOf('\n', start - 1) + 1;
  const before = el.value.slice(lineStart, start);
  const extra = /[{(\[]$/.test(before) ? '  ' : '';
  el.setRangeText(`\n${before.match(/^\s*/)[0]}${extra}`, start, el.selectionEnd, 'end');
}

export function goToLine(line) {
  setTimeout(() => {
    const editor = document.getElementById('editor');
    const offset = editor.value.split('\n').slice(0, line - 1).join('\n').length + (line > 1 ? 1 : 0);
    editor.focus();
    editor.setSelectionRange(offset, offset);
    editor.scrollTop = Math.max(0, (line - 5) * 20.8);
  }, 0);
}

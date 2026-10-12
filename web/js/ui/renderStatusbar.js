export function renderStatusbar(el, store) {
  const info = document.createElement('span');
  const position = document.createElement('span');
  el.replaceChildren(info, position);

  const update = ({ workspacePath, active, dirty }) => {
    const unsaved = dirty.length ? ` | ● ${dirty.length} sin guardar` : '';
    info.textContent = `${workspacePath ?? 'Modo navegador (sin disco)'} | ${active ?? '—'}${unsaved}`;
  };
  document.addEventListener('selectionchange', () => {
    const field = document.activeElement;
    if (field?.tagName !== 'TEXTAREA') return;
    const lines = field.value.slice(0, field.selectionStart).split('\n');
    position.textContent = `Ln ${lines.length}, Col ${lines.at(-1).length + 1}`;
  });
  store.subscribe(update);
  update(store.get());
}

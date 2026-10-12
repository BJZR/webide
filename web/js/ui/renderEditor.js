import { autoIndent } from './autoIndent.js';

export function renderEditor(el, store, key = 'active') {
  const update = (state) => {
    const path = state[key];
    el.disabled = !path;
    const value = path ? state.files[path] ?? '' : '';
    if (el.value !== value) el.value = value;
  };
  el.oninput = () => {
    const { files, [key]: path } = store.get();
    if (!path) return;
    const { dirty, workspace } = store.get();
    store.set({ files: { ...files, [path]: el.value }, dirty: workspace ? [...new Set([...dirty, path])] : dirty });
  };
  el.onkeydown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      el.setRangeText('  ', el.selectionStart, el.selectionEnd, 'end');
    } else if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      autoIndent(el);
    } else return;
    el.oninput();
  };
  store.subscribe(update);
  update(store.get());
}

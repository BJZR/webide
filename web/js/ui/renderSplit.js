import { renderEditor } from './renderEditor.js';

export function renderSplit(el, store) {
  el.innerHTML = '<select aria-label="Archivo del panel derecho"></select><textarea spellcheck="false" aria-label="Editor derecho"></textarea>';
  const select = el.querySelector('select');
  renderEditor(el.querySelector('textarea'), store, 'splitActive');
  let signature = '';
  const update = ({ files, splitActive }) => {
    const paths = Object.keys(files).sort();
    if (paths.join() !== signature) {
      signature = paths.join();
      select.replaceChildren(...paths.map((path) => new Option(path, path)));
    }
    select.value = splitActive ?? '';
  };
  select.onchange = () => store.set({ splitActive: select.value });
  store.subscribe(update);
  update(store.get());
}

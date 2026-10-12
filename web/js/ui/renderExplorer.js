import { openFile } from '../files/openFile.js';
import { deleteFile } from '../files/deleteFile.js';

export function renderExplorer(el, store) {
  const update = ({ files, active }) => {
    el.replaceChildren(...Object.keys(files).sort().map((path) => {
      const row = document.createElement('div');
      row.className = `row${path === active ? ' active' : ''}`;
      row.style.paddingLeft = `${8 + (path.split('/').length - 1) * 12}px`;
      row.textContent = path;
      row.onclick = () => openFile(store, path);
      const remove = document.createElement('button');
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Eliminar ${path}`);
      remove.onclick = (event) => { event.stopPropagation(); deleteFile(store, path); };
      row.append(remove);
      return row;
    }));
  };
  store.subscribe(update);
  update(store.get());
}

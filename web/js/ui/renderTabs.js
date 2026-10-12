import { closeTab } from '../files/closeTab.js';

export function renderTabs(el, store) {
  const update = ({ open, active, dirty }) => {
    el.replaceChildren(...open.map((path) => {
      const tab = document.createElement('div');
      tab.className = `tab${path === active ? ' active' : ''}`;
      tab.textContent = `${dirty.includes(path) ? '● ' : ''}${path.split('/').pop()}`;
      tab.title = path;
      tab.onclick = () => store.set({ active: path });
      const close = document.createElement('button');
      close.textContent = '×';
      close.setAttribute('aria-label', `Cerrar ${path}`);
      close.onclick = (event) => { event.stopPropagation(); closeTab(store, path); };
      tab.append(close);
      return tab;
    }));
  };
  store.subscribe(update);
  update(store.get());
}

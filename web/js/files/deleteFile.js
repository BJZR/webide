import { closeTab } from './closeTab.js';
import { removeFromDisk } from './removeFromDisk.js';

export function deleteFile(store, path) {
  if (!confirm(`¿Eliminar ${path}?`)) return;
  closeTab(store, path);
  const { [path]: removed, ...files } = store.get().files;
  store.set({ files, dirty: store.get().dirty.filter((item) => item !== path) });
  removeFromDisk(store, path);
}

import { persistFiles } from './persistFiles.js';
import { removeFromDisk } from './removeFromDisk.js';

export async function renameFile(store) {
  const { active, files, open, splitActive } = store.get();
  const target = active && prompt('Nueva ruta', active)?.trim();
  if (!target || target === active || target in files) return;
  const { [active]: content, ...rest } = files;
  store.set({
    files: { ...rest, [target]: content },
    open: open.map((path) => (path === active ? target : path)),
    splitActive: splitActive === active ? target : splitActive,
    active: target,
  });
  await persistFiles(store, [target]);
  await removeFromDisk(store, active);
}

import { persistFiles } from './persistFiles.js';
import { appendTerminal } from '../term/appendTerminal.js';

export async function saveActiveFile(store) {
  const { active, workspace } = store.get();
  if (!active) return;
  await persistFiles(store, [active]);
  appendTerminal(store, workspace ? `Guardado en disco: ${active}` : `Guardado en el navegador: ${active}`);
}

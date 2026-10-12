import { loadWorkspace } from './loadWorkspace.js';
import { rememberWorkspace } from './rememberWorkspace.js';
import { appendTerminal } from '../term/appendTerminal.js';

export async function chooseWorkspace(store, path) {
  if (store.get().dirty.length && !confirm('Hay cambios sin guardar. ¿Cambiar de workspace igualmente?')) return;
  const response = await fetch('/api/workspace', { method: 'POST', headers: { 'X-WebIDE': '1' }, body: JSON.stringify({ path }) });
  if (!response.ok) return appendTerminal(store, `No se pudo abrir ${path}: ${await response.text()}`, true);
  rememberWorkspace(path);
  store.set({ open: [], active: null, splitActive: null });
  await loadWorkspace(store);
}

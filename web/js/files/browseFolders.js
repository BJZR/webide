import { chooseWorkspace } from './chooseWorkspace.js';
import { appendTerminal } from '../term/appendTerminal.js';

export async function browseFolders(store, palette, path = '') {
  try {
    const response = await fetch(`/api/dirs?path=${encodeURIComponent(path)}`, { headers: { 'X-WebIDE': '1' } });
    if (!response.ok) throw new Error(await response.text());
    const { path: here, parent, dirs } = await response.json();
    palette(() => [
      { title: `✔ Abrir esta carpeta: ${here}`, run: () => chooseWorkspace(store, here) },
      { title: '⬆ Subir', run: () => browseFolders(store, palette, parent) },
      ...dirs.map((name) => ({ title: `📁 ${name}`, run: () => browseFolders(store, palette, `${here}/${name}`) })),
    ]);
  } catch (error) {
    appendTerminal(store, `No se pudo listar carpetas (¿servidor Go activo?): ${error.message}`, true);
  }
}

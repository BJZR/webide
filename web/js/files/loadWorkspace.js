import { appendTerminal } from '../term/appendTerminal.js';

export async function loadWorkspace(store) {
  try {
    const [filesResponse, infoResponse] = await Promise.all([fetch('/api/files'), fetch('/api/workspace')]);
    if (!filesResponse.ok) throw new Error(`HTTP ${filesResponse.status}`);
    const files = await filesResponse.json();
    const { path } = await infoResponse.json();
    const paths = Object.keys(files).sort();
    const { open, active } = store.get();
    const kept = open.filter((item) => item in files);
    store.set({
      files, workspace: true, workspacePath: path, dirty: [],
      open: kept.length ? kept : paths.slice(0, 1),
      active: active in files ? active : kept[0] ?? paths[0] ?? null,
    });
    appendTerminal(store, `Workspace cargado: ${path} (${paths.length} archivos)`, true);
  } catch (error) {
    appendTerminal(store, `No se pudo abrir el workspace (¿servidor Go activo?): ${error.message}`, true);
  }
}

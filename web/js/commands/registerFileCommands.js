import { openFile } from '../files/openFile.js';
import { createFile } from '../files/createFile.js';
import { closeTab } from '../files/closeTab.js';
import { renameFile } from '../files/renameFile.js';
import { searchProject } from '../files/searchProject.js';
import { saveActiveFile } from '../files/saveActiveFile.js';
import { loadWorkspace } from '../files/loadWorkspace.js';
import { browseFolders } from '../files/browseFolders.js';
import { chooseWorkspace } from '../files/chooseWorkspace.js';
import { getRecentWorkspaces } from '../files/getRecentWorkspaces.js';
import { createBackup } from '../backup/createBackup.js';
import { downloadBackup } from '../backup/downloadBackup.js';

export function registerFileCommands(registry, store, palette) {
  const quickOpen = () => palette(() => Object.keys(store.get().files).sort()
    .map((path) => ({ title: path, run: () => openFile(store, path) })));
  const recents = () => palette(() => getRecentWorkspaces()
    .map((path) => ({ title: path, run: () => chooseWorkspace(store, path) })));
  [
    { id: 'file.quickOpen', title: 'Ir a archivo…', keys: ['ctrl+p'], run: quickOpen },
    { id: 'file.save', title: 'Guardar', keys: ['ctrl+s'], run: () => saveActiveFile(store) },
    { id: 'file.new', title: 'Nuevo archivo', keys: ['ctrl+alt+n'], run: () => createFile(store, prompt('Ruta (ej: src/utils/sum.js)')) },
    { id: 'file.rename', title: 'Renombrar archivo activo…', keys: ['f2'], run: () => renameFile(store) },
    { id: 'tab.close', title: 'Cerrar pestaña activa', keys: ['alt+w'], run: () => store.get().active && closeTab(store, store.get().active) },
    { id: 'search.project', title: 'Buscar en el proyecto…', keys: ['ctrl+shift+f'], run: () => searchProject(store, palette) },
    { id: 'workspace.browse', title: 'Workspace: abrir carpeta…', keys: ['ctrl+o'], run: () => browseFolders(store, palette) },
    { id: 'workspace.recent', title: 'Workspace: recientes…', keys: [], run: recents },
    { id: 'workspace.open', title: 'Workspace: recargar desde disco', keys: [], run: () => loadWorkspace(store) },
    { id: 'backup.download', title: 'Respaldo: descargar', keys: [], run: () => downloadBackup(createBackup(store.get().files)) },
  ].forEach(registry.register);
}

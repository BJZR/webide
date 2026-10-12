import { showPanel } from '../layout/showPanel.js';
import { toggleLayout } from '../layout/toggleLayout.js';
import { emitBrowser } from '../browser/emitBrowser.js';

export function registerBrowserCommands(registry, store) {
  const reveal = (name, detail) => {
    showPanel(store, 'browser');
    emitBrowser(name, detail);
  };
  [
    { id: 'browser.toggle', title: 'Ver: navegador', keys: ['alt+b'], run: () => toggleLayout(store, 'browser') },
    { id: 'browser.new', title: 'Navegador: nueva pestaña', keys: ['alt+t'], run: () => reveal('new') },
    { id: 'browser.focus', title: 'Navegador: barra de direcciones', keys: ['alt+l'], run: () => reveal('focus') },
    { id: 'browser.preview', title: 'Navegador: vista previa del archivo activo', keys: ['alt+p'], run: () => reveal('preview', { file: store.get().active }) },
  ].forEach(registry.register);
}

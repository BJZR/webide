import { toggleLayout } from '../layout/toggleLayout.js';
import { toggleSplit } from '../layout/toggleSplit.js';

export function registerLayoutCommands(registry, store, palette) {
  const showCommands = () => palette(() => registry.list()
    .map(({ title, keys, run }) => ({ title, hint: keys[0], run })));
  [
    { id: 'palette', title: 'Paleta de comandos', keys: ['f1', 'ctrl+shift+p'], run: showCommands },
    { id: 'view.sidebar', title: 'Ver: explorador', keys: ['ctrl+b'], run: () => toggleLayout(store, 'sidebar') },
    { id: 'view.terminal', title: 'Ver: terminal', keys: ['ctrl+`'], run: () => toggleLayout(store, 'terminal') },
    { id: 'view.chat', title: 'Ver: agente IA', keys: ['alt+c'], run: () => toggleLayout(store, 'chat') },
    { id: 'view.split', title: 'Ver: vista dividida', keys: ['ctrl+\\'], run: () => toggleSplit(store) },
  ].forEach(registry.register);
}

import { createStore } from './state/createStore.js';
import { loadProject } from './state/loadProject.js';
import { saveProject } from './state/saveProject.js';
import { RUNTIME_STATE } from './config/defaults.js';
import { renderExplorer } from './ui/renderExplorer.js';
import { renderTabs } from './ui/renderTabs.js';
import { renderEditor } from './ui/renderEditor.js';
import { renderChat } from './ui/renderChat.js';
import { renderSplit } from './ui/renderSplit.js';
import { renderBrowser } from './ui/renderBrowser.js';
import { renderTerminal } from './ui/renderTerminal.js';
import { createPalette } from './ui/createPalette.js';
import { applyLayout } from './ui/applyLayout.js';
import { createCommandRegistry } from './commands/createCommandRegistry.js';
import { registerFileCommands } from './commands/registerFileCommands.js';
import { registerLayoutCommands } from './commands/registerLayoutCommands.js';
import { registerGitCommands } from './commands/registerGitCommands.js';
import { registerBrowserCommands } from './commands/registerBrowserCommands.js';
import { renderStatusbar } from './ui/renderStatusbar.js';
import { bindKeys } from './commands/bindKeys.js';
import { appendTerminal } from './term/appendTerminal.js';
import { loadPlugins } from './plugins/loadPlugins.js';

async function main() {
  const store = createStore({ ...loadProject(), ...RUNTIME_STATE });
  const registry = createCommandRegistry();
  const palette = createPalette(document.getElementById('palette'));
  const $ = (selector) => document.querySelector(selector);

  renderExplorer($('#explorer'), store);
  renderTabs($('#tabs'), store);
  renderEditor($('#editor'), store);
  renderSplit($('#split'), store);
  renderBrowser($('#browser'), store);
  renderTerminal($('#terminal'), store);
  renderStatusbar($('#statusbar'), store);
  renderChat($('#chat'), store);
  applyLayout(store);
  store.subscribe(saveProject);

  registerFileCommands(registry, store, palette);
  registerLayoutCommands(registry, store, palette);
  registerGitCommands(registry, store);
  registerBrowserCommands(registry, store);
  bindKeys(registry);
  $('#btn-new').onclick = () => registry.run('file.new');
  $('#btn-palette').onclick = () => registry.run('palette');

  await loadPlugins({ registry, store, log: (message) => appendTerminal(store, message, true) });
}

main();

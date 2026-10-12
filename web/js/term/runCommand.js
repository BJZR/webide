import { splitArgs } from './splitArgs.js';
import { appendTerminal } from './appendTerminal.js';
import { persistFiles } from '../files/persistFiles.js';
import { loadWorkspace } from '../files/loadWorkspace.js';

const TREE_CHANGING = /^git (pull|checkout|switch|merge|reset|stash|rebase)/;

export async function runCommand(store, input) {
  const args = Array.isArray(input) ? input : splitArgs(input);
  appendTerminal(store, `$ ${args.join(' ')}`, true);
  if (!store.get().workspace) return appendTerminal(store, 'Abre un workspace primero (servidor Go): F1 → Workspace.');
  try {
    await persistFiles(store, Object.keys(store.get().files));
    const response = await fetch('/api/exec', { method: 'POST', headers: { 'X-WebIDE': '1' }, body: JSON.stringify({ args }) });
    if (!response.ok) throw new Error(await response.text());
    const { output, code } = await response.json();
    appendTerminal(store, output.trimEnd() + (code ? `\n[salida ${code}]` : ''));
    if (TREE_CHANGING.test(args.join(' '))) await loadWorkspace(store);
  } catch (error) {
    appendTerminal(store, `Error: ${error.message}`);
  }
}

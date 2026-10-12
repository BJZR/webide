import { sendToProvider } from './sendToProvider.js';
import { buildAgentContext } from './buildAgentContext.js';
import { applyAgentFiles } from './applyAgentFiles.js';
import { persistFiles } from '../files/persistFiles.js';
import { createBackup } from '../backup/createBackup.js';

export async function runAgentTurn(store, text) {
  const chat = [...store.get().chat, { role: 'user', content: text }];
  store.set({ chat, busy: true });
  try {
    createBackup(store.get().files);
    const state = store.get();
    const system = { role: 'system', content: buildAgentContext(state) };
    const reply = await sendToProvider(state.settings, [system, ...chat]);
    const written = applyAgentFiles(store, reply);
    await persistFiles(store, written);
    const note = written.length ? `\n\n✔ Escritos: ${written.join(', ')} (respaldo previo creado)` : '';
    store.set({ chat: [...store.get().chat, { role: 'assistant', content: reply + note }] });
  } catch (error) {
    store.set({ chat: [...store.get().chat, { role: 'assistant', content: `Error: ${error.message}` }] });
  } finally {
    store.set({ busy: false });
  }
}

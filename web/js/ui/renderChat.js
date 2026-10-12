import { PROVIDER_PRESETS, PROVIDER_MODELS } from '../config/defaults.js';
import { runAgentTurn } from '../ai/runAgentTurn.js';

const QUICK_PROMPTS = [
  ['Documentar', 'Documenta el archivo activo con JSDoc y actualiza README.md.'],
  ['Revisar', 'Revisa el proyecto: bugs, clean code y un archivo por función.'],
  ['Refactor', 'Refactoriza el archivo activo aplicando clean code.'],
];

export function renderChat(el, store) {
  const providers = Object.keys(PROVIDER_PRESETS).map((name) => `<option>${name}</option>`).join('');
  el.innerHTML = `
    <details class="settings"><summary>Proveedor IA</summary>
      <select id="provider">${providers}</select>
      <input id="url" placeholder="URL base">
      <input id="model" placeholder="Modelo">
      <input id="key" type="password" placeholder="API key (opcional)">
    </details>
    <div class="log"></div><div class="chips"></div>
    <div class="compose"><textarea placeholder="Pide código, revisión o documentación"></textarea><button>Enviar</button></div>`;
  const $ = (selector) => el.querySelector(selector);
  const [log, chips, input] = [$('.log'), $('.chips'), $('textarea')];

  const send = (text) => {
    if (!text.trim() || store.get().busy) return;
    input.value = '';
    runAgentTurn(store, text);
  };

  QUICK_PROMPTS.forEach(([label, prompt]) => {
    const chip = document.createElement('button');
    chip.textContent = label;
    chip.onclick = () => send(prompt);
    chips.append(chip);
  });

  const saveSettings = () => store.set({ settings: {
    provider: $('#provider').value, url: $('#url').value, model: $('#model').value, key: $('#key').value,
  } });
  $('#provider').onchange = () => {
    const name = $('#provider').value;
    $('#url').value = PROVIDER_PRESETS[name];
    $('#model').value = PROVIDER_MODELS[name] ?? $('#model').value;
    saveSettings();
  };
  ['#url', '#model', '#key'].forEach((id) => { $(id).oninput = saveSettings; });
  $('.compose button').onclick = () => send(input.value);
  input.onkeydown = (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) send(input.value);
  };

  let lastChat = null;
  let lastBusy = null;
  const update = ({ chat, busy }) => {
    if (chat === lastChat && busy === lastBusy) return;
    [lastChat, lastBusy] = [chat, busy];
    const items = busy ? [...chat, { role: 'assistant', content: 'Pensando…' }] : chat;
    log.replaceChildren(...items.map(({ role, content }) => {
      const msg = document.createElement('div');
      msg.className = `msg ${role}`;
      msg.textContent = content;
      return msg;
    }));
    log.scrollTop = log.scrollHeight;
  };
  const { settings } = store.get();
  $('#provider').value = settings.provider;
  $('#url').value = settings.url;
  $('#model').value = settings.model;
  $('#key').value = settings.key;
  store.subscribe(update);
  update(store.get());
}

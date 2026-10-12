import { runCommand } from '../term/runCommand.js';

export function renderTerminal(el, store) {
  el.innerHTML = '<pre></pre><input placeholder="git status · make · cmake --build build" aria-label="Terminal">';
  const output = el.querySelector('pre');
  const input = el.querySelector('input');
  input.onkeydown = (event) => {
    if (event.key !== 'Enter' || !input.value.trim()) return;
    runCommand(store, input.value);
    input.value = '';
  };
  let last = null;
  store.subscribe(({ term }) => {
    if (term === last) return;
    last = term;
    output.textContent = term;
    output.scrollTop = output.scrollHeight;
  });
}

import { normalizeKey } from './normalizeKey.js';

export function bindKeys(registry) {
  document.addEventListener('keydown', (event) => {
    const combo = normalizeKey(event);
    const command = registry.list().find(({ keys }) => keys.includes(combo));
    if (!command) return;
    event.preventDefault();
    command.run();
  });
}

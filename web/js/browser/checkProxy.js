import { PROXY_ORIGIN } from '../config/defaults.js';

export function checkProxy() {
  return fetch(`${PROXY_ORIGIN}/ping`, { mode: 'no-cors' }).then(() => true, () => false);
}

import { STORAGE_KEY, DEFAULT_STATE } from '../config/defaults.js';

export function loadProject() {
  try {
    return { ...DEFAULT_STATE, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return DEFAULT_STATE;
  }
}

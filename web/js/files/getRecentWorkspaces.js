import { RECENTS_KEY } from '../config/defaults.js';

export function getRecentWorkspaces() {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY)) ?? [];
  } catch {
    return [];
  }
}

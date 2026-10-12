import { RECENTS_KEY } from '../config/defaults.js';
import { getRecentWorkspaces } from './getRecentWorkspaces.js';

export function rememberWorkspace(path) {
  const recents = [path, ...getRecentWorkspaces().filter((item) => item !== path)].slice(0, 8);
  localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
}

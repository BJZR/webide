import { BACKUP_KEY } from '../config/defaults.js';

const MAX_SNAPSHOTS = 10;

export function createBackup(files) {
  const snapshot = { at: new Date().toISOString(), files };
  try {
    const previous = JSON.parse(localStorage.getItem(BACKUP_KEY)) ?? [];
    localStorage.setItem(BACKUP_KEY, JSON.stringify([...previous, snapshot].slice(-MAX_SNAPSHOTS)));
  } catch (error) {
    console.warn('Respaldo local no guardado:', error);
  }
  fetch('/api/backup', { method: 'POST', body: JSON.stringify(snapshot) }).catch(() => {});
  return snapshot;
}

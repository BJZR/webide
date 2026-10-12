import { STORAGE_KEY } from '../config/defaults.js';

export function saveProject({ files, open, active, settings, chat }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ files, open, active, settings, chat }));
  } catch (error) {
    console.warn('No se pudo guardar el proyecto:', error);
  }
}

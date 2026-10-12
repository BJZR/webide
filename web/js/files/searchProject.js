import { openFile } from './openFile.js';
import { goToLine } from './goToLine.js';

const MAX_HITS = 200;

export function searchProject(store, palette) {
  const query = prompt('Buscar en el proyecto')?.toLowerCase();
  if (!query) return;
  const hits = [];
  for (const [path, content] of Object.entries(store.get().files)) {
    content.split('\n').forEach((line, index) => {
      if (hits.length >= MAX_HITS || !line.toLowerCase().includes(query)) return;
      hits.push({
        title: `${path}:${index + 1}  ${line.trim().slice(0, 80)}`,
        run: () => { openFile(store, path); goToLine(index + 1); },
      });
    });
  }
  palette(() => (hits.length ? hits : [{ title: 'Sin resultados', run() {} }]));
}

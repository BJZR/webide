const MAX_CHARS_PER_FILE = 4000;

export function buildAgentContext({ files, active }) {
  const listing = Object.entries(files)
    .map(([path, content]) => `--- ${path} ---\n${content.slice(0, MAX_CHARS_PER_FILE)}`)
    .join('\n\n');
  return [
    'Eres un agente de desarrollo dentro de un IDE web. Responde en español, breve y directo.',
    'Reglas: clean code, código funcional, un archivo = una función, nombres claros, estructura ordenada.',
    'Para crear o modificar archivos responde con bloques exactos:',
    '```file:ruta/archivo.js\n<contenido completo>\n```',
    `Archivo activo: ${active ?? 'ninguno'}`,
    `Proyecto:\n${listing}`,
  ].join('\n');
}

const FILE_BLOCK = /```file:([^\n]+)\n([\s\S]*?)```/g;

export function applyAgentFiles(store, reply) {
  const files = { ...store.get().files };
  const written = [];
  for (const [, rawPath, content] of reply.matchAll(FILE_BLOCK)) {
    const path = rawPath.trim();
    files[path] = content.replace(/\n$/, '');
    written.push(path);
  }
  if (written.length) {
    const { open } = store.get();
    store.set({ files, open: [...new Set([...open, ...written])], active: written[0] });
  }
  return written;
}

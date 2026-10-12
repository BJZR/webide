export function createFile(store, path) {
  const { files, open } = store.get();
  const clean = (path || '').trim();
  if (!clean || clean in files) return;
  store.set({ files: { ...files, [clean]: '' }, open: [...open, clean], active: clean });
}

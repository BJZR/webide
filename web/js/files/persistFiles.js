export async function persistFiles(store, paths) {
  const { files, workspace } = store.get();
  if (!workspace) return;
  await Promise.all(paths.map((path) => fetch(`/api/file?path=${encodeURIComponent(path)}`, {
    method: 'PUT', headers: { 'X-WebIDE': '1' }, body: files[path],
  })));
  store.set({ dirty: store.get().dirty.filter((path) => !paths.includes(path)) });
}

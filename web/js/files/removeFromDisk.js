export async function removeFromDisk(store, path) {
  if (!store.get().workspace) return;
  await fetch(`/api/file?path=${encodeURIComponent(path)}`, { method: 'DELETE', headers: { 'X-WebIDE': '1' } });
}

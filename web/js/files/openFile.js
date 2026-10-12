export function openFile(store, path) {
  const { open } = store.get();
  store.set({ open: open.includes(path) ? open : [...open, path], active: path });
}

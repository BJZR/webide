export function showPanel(store, key) {
  store.set({ layout: { ...store.get().layout, [key]: true } });
}

export function toggleLayout(store, key) {
  const { layout } = store.get();
  store.set({ layout: { ...layout, [key]: !layout[key] } });
}

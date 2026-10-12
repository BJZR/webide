export function toggleSplit(store) {
  const { layout, splitActive, active } = store.get();
  store.set({ layout: { ...layout, split: !layout.split }, splitActive: splitActive ?? active });
}

export function closeTab(store, path) {
  const { open, active } = store.get();
  const remaining = open.filter((item) => item !== path);
  store.set({ open: remaining, active: active === path ? remaining.at(-1) ?? null : active });
}

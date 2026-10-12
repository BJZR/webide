export function appendTerminal(store, text, reveal = false) {
  const { term, layout } = store.get();
  store.set({ term: `${term}${text}\n`.slice(-20000), layout: reveal ? { ...layout, terminal: true } : layout });
}

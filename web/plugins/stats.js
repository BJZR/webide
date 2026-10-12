export function activate({ registry, store, log }) {
  registry.register({
    id: 'plugin.stats',
    title: 'Plugin: estadísticas del archivo',
    keys: [],
    run() {
      const { files, active } = store.get();
      const text = files[active] ?? '';
      log(`${active}: ${text.split('\n').length} líneas, ${text.split(/\s+/).filter(Boolean).length} palabras`);
    },
  });
}

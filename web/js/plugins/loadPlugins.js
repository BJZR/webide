export async function loadPlugins(api) {
  const names = await fetch('plugins/plugins.json').then((response) => response.json()).catch(() => []);
  for (const name of names) {
    try {
      const plugin = await import(`../../plugins/${name}`);
      plugin.activate(api);
    } catch (error) {
      api.log(`Plugin ${name} falló: ${error.message}`);
    }
  }
}

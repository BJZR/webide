export function createCommandRegistry() {
  const commands = new Map();
  return {
    register: (command) => commands.set(command.id, command),
    list: () => [...commands.values()],
    run: (id) => commands.get(id)?.run(),
  };
}

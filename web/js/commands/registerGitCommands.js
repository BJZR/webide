import { runCommand } from '../term/runCommand.js';

const SHORTCUTS = [
  ['git.status', 'Git: estado', 'git status -sb', ['alt+g']],
  ['git.diff', 'Git: diff', 'git diff --stat'],
  ['git.log', 'Git: historial', 'git log --oneline --graph -15'],
  ['git.add', 'Git: añadir todo', 'git add -A'],
  ['git.pull', 'Git: pull', 'git pull'],
  ['git.push', 'Git: push', 'git push'],
  ['make.build', 'Make: make', 'make', ['alt+m']],
  ['make.clean', 'Make: clean', 'make clean'],
  ['cmake.configure', 'CMake: configurar', 'cmake -S . -B build'],
  ['cmake.build', 'CMake: compilar', 'cmake --build build'],
];

async function commitAll(store) {
  const message = prompt('Mensaje del commit');
  if (!message) return;
  await runCommand(store, 'git add -A');
  await runCommand(store, ['git', 'commit', '-m', message]);
}

export function registerGitCommands(registry, store) {
  SHORTCUTS.forEach(([id, title, command, keys = []]) =>
    registry.register({ id, title, keys, run: () => runCommand(store, command) }));
  registry.register({ id: 'git.commit', title: 'Git: commit de todo…', keys: ['alt+enter'], run: () => commitAll(store) });
}

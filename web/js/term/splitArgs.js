export function splitArgs(text) {
  return [...text.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(([, double, single, bare]) => double ?? single ?? bare);
}

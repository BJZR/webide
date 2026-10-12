export function emitBrowser(name, detail = {}) {
  document.dispatchEvent(new CustomEvent(`browser:${name}`, { detail }));
}

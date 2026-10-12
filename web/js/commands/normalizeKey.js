export function normalizeKey(event) {
  const key = event.code.startsWith('Key') ? event.code.slice(3).toLowerCase() : event.key.toLowerCase();
  const modifiers = [event.ctrlKey || event.metaKey ? 'ctrl' : '', event.altKey ? 'alt' : '', event.shiftKey ? 'shift' : ''];
  return [...modifiers.filter(Boolean), key].join('+');
}

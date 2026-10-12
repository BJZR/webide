const SEARCH_URL = 'https://duckduckgo.com/html/?q=';

export function normalizeUrl(text) {
  const value = text.trim();
  if (/^https?:\/\//i.test(value)) return value;
  if (/^(localhost|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/|$)/.test(value)) return `http://${value}`;
  if (/^[^\s/]+\.[a-z]{2,}(:\d+)?(\/\S*)?$/i.test(value)) return `https://${value}`;
  return SEARCH_URL + encodeURIComponent(value);
}

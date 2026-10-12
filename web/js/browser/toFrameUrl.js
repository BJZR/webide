import { PROXY_ORIGIN } from '../config/defaults.js';

const LOCAL_HOST = /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

export function toFrameUrl(url, proxyUp) {
  const { hostname } = new URL(url);
  return proxyUp && !LOCAL_HOST.test(hostname) ? `${PROXY_ORIGIN}/proxy?url=${encodeURIComponent(url)}` : url;
}

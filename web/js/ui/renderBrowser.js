import { buildPreview } from '../browser/buildPreview.js';
import { normalizeUrl } from '../browser/normalizeUrl.js';
import { toFrameUrl } from '../browser/toFrameUrl.js';
import { checkProxy } from '../browser/checkProxy.js';

const WEB_SANDBOX = 'allow-scripts allow-forms allow-popups allow-same-origin';
const PREVIEW_SANDBOX = 'allow-scripts allow-forms allow-popups';

export function renderBrowser(el, store) {
  el.innerHTML = `<div class="btabs"></div>
    <div class="bar"><button title="Atrás">◀</button><button title="Adelante">▶</button><button title="Recargar">⟳</button>
    <input type="text" placeholder="Busca o escribe una URL" aria-label="Dirección" autocomplete="off"><button title="Abrir fuera">↗</button></div>
    <div class="views"></div>`;
  const tabsEl = el.querySelector('.btabs');
  const views = el.querySelector('.views');
  const input = el.querySelector('input');
  const [back, forward, reload, outside] = el.querySelectorAll('.bar button');
  const tabs = [];
  let current = null;
  let proxyUp = false;
  let counter = 0;
  let wasVisible = false;
  let timer;
  checkProxy().then((up) => { proxyUp = up; });

  const draw = () => {
    const items = tabs.map((tab) => {
      const item = document.createElement('div');
      item.className = `btab${tab === current ? ' active' : ''}`;
      item.textContent = tab.title;
      item.onclick = () => select(tab);
      const close = document.createElement('button');
      close.textContent = '×';
      close.setAttribute('aria-label', 'Cerrar pestaña');
      close.onclick = (event) => { event.stopPropagation(); closeBrowserTab(tab); };
      item.append(close);
      return item;
    });
    const plus = document.createElement('button');
    plus.textContent = '+';
    plus.setAttribute('aria-label', 'Nueva pestaña');
    plus.onclick = () => { openTab(); input.focus(); };
    tabsEl.replaceChildren(...items, plus);
    tabs.forEach((tab) => { tab.frame.hidden = tab !== current; });
    input.value = current?.kind === 'web' ? current.history[current.index] ?? '' : '';
  };

  const select = (tab) => { current = tab; draw(); };

  const openTab = (init = {}) => {
    const frame = document.createElement('iframe');
    frame.title = 'Navegador';
    frame.hidden = true;
    const tab = { kind: 'web', title: 'Nueva pestaña', history: [], index: -1, frame, ...init };
    tabs.push(tab);
    views.append(frame);
    select(tab);
    return tab;
  };

  const load = (tab) => {
    const url = tab.history[tab.index];
    tab.frame.sandbox = WEB_SANDBOX;
    tab.frame.src = toFrameUrl(url, proxyUp);
    tab.title = new URL(url).hostname;
    draw();
  };

  const navigate = (tab, text) => {
    const url = normalizeUrl(text);
    tab.kind = 'web';
    tab.frame.removeAttribute('srcdoc');
    tab.history = [...tab.history.slice(0, tab.index + 1), url];
    tab.index += 1;
    load(tab);
  };

  const closeBrowserTab = (tab) => {
    tabs.splice(tabs.indexOf(tab), 1);
    tab.frame.remove();
    current = current === tab ? tabs.at(-1) ?? null : current;
    draw();
  };

  const refreshPreviews = (files) => tabs.filter((tab) => tab.kind === 'preview').forEach((tab) => {
    const doc = buildPreview(files, tab.file);
    if (doc === tab.doc) return;
    tab.doc = doc;
    tab.frame.srcdoc = doc;
  });

  input.onfocus = () => input.select();
  input.onkeydown = (event) => {
    if (!event.ctrlKey && !event.altKey && !event.metaKey) event.stopPropagation();
    if (event.key === 'Enter' && input.value.trim()) navigate(current ?? openTab(), input.value);
  };
  back.onclick = () => { if (current?.index > 0) { current.index -= 1; load(current); } };
  forward.onclick = () => { if (current && current.index < current.history.length - 1) { current.index += 1; load(current); } };
  reload.onclick = () => { if (current?.kind === 'web' && current.index >= 0) load(current); };
  outside.onclick = () => { if (input.value) window.open(normalizeUrl(input.value), '_blank', 'noopener'); };

  window.addEventListener('message', ({ source, data }) => {
    const tab = tabs.find((item) => item.frame.contentWindow === source);
    if (!tab || !data?.webide) return;
    if (data.type === 'nav') navigate(tab, data.url);
    if (data.type === 'loaded') {
      tab.history[tab.index] = data.url;
      tab.title = data.title || new URL(data.url).hostname;
      draw();
    }
  });

  document.addEventListener('browser:new', () => { openTab(); input.focus(); });
  document.addEventListener('browser:focus', () => { if (!current) openTab(); input.focus(); });
  document.addEventListener('browser:open', ({ detail }) => navigate(openTab(), detail.url));
  document.addEventListener('browser:preview', ({ detail: { file } }) => {
    if (!file) return;
    const existing = tabs.find((tab) => tab.kind === 'preview' && tab.file === file);
    if (existing) select(existing);
    else {
      const tab = openTab({ kind: 'preview', file, title: `▶ ${file.split('/').pop()}` });
      tab.frame.sandbox = PREVIEW_SANDBOX;
    }
    refreshPreviews(store.get().files);
  });

  store.subscribe(({ files, layout }) => {
    clearTimeout(timer);
    timer = setTimeout(() => refreshPreviews(files), 300);
    if (layout.browser && !wasVisible) {
      setTimeout(() => { if (!tabs.length) openTab(); input.focus(); }, 0);
    }
    wasVisible = layout.browser;
  });
}

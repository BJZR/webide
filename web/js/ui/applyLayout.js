export function applyLayout(store) {
  const show = (id, visible) => { document.getElementById(id).hidden = !visible; };
  const apply = ({ layout }) => {
    show('explorer', layout.sidebar);
    show('terminal', layout.terminal);
    show('chat', layout.chat);
    show('split', layout.split);
    show('browser', layout.browser);
  };
  store.subscribe(apply);
  apply(store.get());
}

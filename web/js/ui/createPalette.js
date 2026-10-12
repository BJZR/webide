export function createPalette(dialog) {
  const input = dialog.querySelector('input');
  const list = dialog.querySelector('ul');
  let items = [];
  let shown = [];
  let index = 0;

  const choose = (position) => {
    const item = shown[position];
    if (!item) return;
    dialog.close();
    item.run();
  };

  const draw = () => {
    const query = input.value.toLowerCase();
    shown = items.filter((item) => item.title.toLowerCase().includes(query)).slice(0, 30);
    index = Math.min(index, Math.max(shown.length - 1, 0));
    list.replaceChildren(...shown.map((item, position) => {
      const row = document.createElement('li');
      row.textContent = item.title;
      row.className = position === index ? 'on' : '';
      row.onclick = () => choose(position);
      if (item.hint) {
        const hint = document.createElement('kbd');
        hint.textContent = item.hint;
        row.append(hint);
      }
      return row;
    }));
  };

  input.oninput = () => { index = 0; draw(); };
  input.onkeydown = (event) => {
    if (event.key === 'Enter') return choose(index);
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    index = Math.max(0, Math.min(index + (event.key === 'ArrowDown' ? 1 : -1), shown.length - 1));
    draw();
  };

  return function openPalette(getItems) {
    items = getItems();
    input.value = '';
    index = 0;
    draw();
    dialog.showModal();
    input.focus();
  };
}

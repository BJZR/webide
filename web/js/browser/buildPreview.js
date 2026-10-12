function resolve(dir, href) {
  const parts = [...dir];
  href.split('/').forEach((segment) => {
    if (segment === '..') parts.pop();
    else if (segment !== '.' && segment !== '') parts.push(segment);
  });
  return parts.join('/');
}

export function buildPreview(files, path) {
  const dir = path.split('/').slice(0, -1);
  const read = (href) => files[resolve(dir, href)];
  return (files[path] ?? '')
    .replace(/<link[^>]*href=["']([^"']+)["'][^>]*>/g, (tag, href) =>
      !/stylesheet/.test(tag) || read(href) === undefined ? tag : `<style>${read(href)}</style>`)
    .replace(/<script([^>]*)src=["']([^"']+)["']([^>]*)><\/script>/g, (tag, before, href, after) =>
      read(href) === undefined || /module/.test(before + after) ? tag : `<script>${read(href)}</script>`);
}

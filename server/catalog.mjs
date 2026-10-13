import { readFileSync } from 'node:fs';
export function loadCatalog() {
  const catalog = { concepts: [], questions: [], scenarios: [] };
  for (const name of ['foundations','practice']) {
    const data=JSON.parse(readFileSync(new URL(`../content/${name}.json`,import.meta.url),'utf8'));
    for (const key of Object.keys(catalog)) catalog[key].push(...(data[key] || []));
  }
  return catalog;
}

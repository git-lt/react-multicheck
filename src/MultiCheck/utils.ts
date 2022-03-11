import type { Option } from "./interface";

export function groupByColumn(list: Option[], column: number) {
  if (!list.length) return [];
  if (column <= 1) return [list];
  const pageSize = Math.floor(list.length / column);
  let res = [];
  let temp = list.slice();
  while (temp.length) {
    res.push(temp.splice(0, pageSize));
  }
  return res;
}

export function normalizeOptions(list: any[]): Option[]{
  return list.map(v => {
    if(typeof v === 'string' || typeof v === 'boolean'){
      return { label: String(v), value: String(v)}
    }
    return v;
  })
}

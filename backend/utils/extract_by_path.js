export function extractByPath(obj, pathExpr) {
  if (!pathExpr || typeof pathExpr !== 'string') {
    return obj;
  }

  const tokens = pathExpr
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .map((t) => t.trim())
    .filter(Boolean);

  let current = obj;
  for (const token of tokens) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[token];
  }

  return current;
}
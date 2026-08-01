export function matchRoute(pattern, pathname) {
  const patternParts = pattern.split("/").filter(Boolean);
  const pathParts = pathname.split("/").filter(Boolean);

  if (patternParts.length !== pathParts.length) {
    return { match: false, params: null };
  }

  const params = {};

  for (let i = 0; i < patternParts.length; i++) {
    const p = patternParts[i];
    const v = pathParts[i];

    if (p.startsWith(":")) {
      params[p.slice(1)] = v;
    } else if (p !== v) {
      return { match: false, params: null };
    }
  }

  return { match: true, params };
}

export function tryParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
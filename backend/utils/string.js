export function toSnakeCase(str) {
  return String(str)
    .replace(/[-\s]+/g, '_')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/__+/g, '_')
    .toLowerCase();
}

export function toCamelCase(str) {
  return str.replace(/[ _-]+([a-z])/g, (_, letter) => letter.toUpperCase());
}
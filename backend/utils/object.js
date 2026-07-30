export function deepMerge(target, source) {
  if (typeof target !== 'object' || target === null)
    return source;

  if (typeof source !== 'object' || source === null)
    return source;

  const output = Array.isArray(target) ? [...target] : { ...target };

  for (const key of Object.keys(source)) {
    const value = source[key];

    if (Array.isArray(value)) {
      output[key] = Array.isArray(output[key])
        ? [...output[key], ...value]
        : [...value];
    } else if (typeof value === 'object' && value !== null) {
      output[key] = deepMerge(output[key], value);
    } else {
      output[key] = value;
    }
  }

  return output;
}

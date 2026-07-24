export function getDarkerColor(color, amount = 0.2) {
  if (!color)
    return color;
  
  const [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
  const newR = Math.round(Math.max(0, Math.min(255, r - r * amount)));
  const newG = Math.round(Math.max(0, Math.min(255, g - g * amount)));
  const newB = Math.round(Math.max(0, Math.min(255, b - b * amount)));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export function getLighterColor(color, amount = 0.2) {
  if (!color)
    return color;

  const [r, g, b] = color.match(/\w\w/g).map((c) => parseInt(c, 16));
  const newR = Math.round(Math.max(0, Math.min(255, r + (255 - r) * amount)));
  const newG = Math.round(Math.max(0, Math.min(255, g + (255 - g) * amount)));
  const newB = Math.round(Math.max(0, Math.min(255, b + (255 - b) * amount)));
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
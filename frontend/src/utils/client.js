export function generateClientIdentifiers(clientName) {
  if (!clientName) return { code: '', token: '' };

  const normalized = clientName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim();

  const words = normalized.split(/\s+/);

  const code = words
    .map(w => w[0].toUpperCase())
    .join('')
    .slice(0, 4);

  const letters = normalized.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const numbers = Math.floor(100 + Math.random() * 900); // 3 dígitos

  const token = `${letters}${numbers}`;

  return { code, token };
}

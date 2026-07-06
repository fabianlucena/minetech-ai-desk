export function generateClientIdentifiers(clientName) {
  if (!clientName) return { code: '', accessCode: '' };

  const normalized = clientName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z\s]/g, '')
    .trim();

  const words = normalized.split(/\s+/);

  let code = words
    .map(w => w[0].toLowerCase())
    .join('')
    .concat(words[words.length - 1].slice(1, 4).toLowerCase())
    .slice(0, 4);

  if (code.length < 4) {
    let i = 0;
    do {
      let j = i + 1;
      code = code.substring(0, j)
        + words[i].substring(1, 5 - code.length).toLowerCase()
        + code.substring(j);

      i++;
    } while (code.length < 4 && i < words.length);

    while (code.length < 3)
      code = code[0] + code;

    console.log('Generated code:', code);
  }

  let letters = normalized.replace(/\s+/g, '').slice(0, 3).toLowerCase();
  if (letters.length < 3)
    letters = code.slice(0, 3);

  const numbers = Math.floor(100 + Math.random() * 900);

  const accessCode = `${letters}-${numbers}`;

  return { code, accessCode };
}

import config from '../config.js';

function cleanText(raw) {
  return raw
    .replace(/\\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function chunkSegment(
  text,
  baseMetadata,
  startIndex = 0,
  options,
) {
  options ??= {};
  const chunkSize = options.chunkSize ?? config.chunkSize ?? 800;
  const overlap = Math.min(options.overlap ?? config.overlap ?? 120, Math.floor(chunkSize / 4));
  const normalized = cleanText(text);

  if (!normalized)
    return [];

  const chunks = [];
  let cursor = 0;
  let idx = startIndex;

  while (cursor < normalized.length) {
    let end = Math.min(cursor + chunkSize, normalized.length);

    if (end < normalized.length) {
      const slice = normalized.slice(cursor, end);
      const lastBreak = Math.max(
        slice.lastIndexOf('\n\n'),
        slice.lastIndexOf('\n'),
        slice.lastIndexOf('. ')
      );

      if (lastBreak > Math.floor(chunkSize * 0.5)) {
        end = cursor + lastBreak + (slice[lastBreak] === '.' ? 1 : 0);
      } else {
        const lastSpace = slice.lastIndexOf(' ');
        if (lastSpace > Math.floor(chunkSize * 0.5)) {
          end = cursor + lastSpace;
        }
      }
    }

    const content = normalized.slice(cursor, end).trim();
    if (content) {
      chunks.push({
        index: idx++,
        content,
        metadata: { ...baseMetadata },
      });
    }

    if (end >= normalized.length) break;
    cursor = Math.max(end - overlap, cursor + 1);
  }

  return chunks;
}

export function buildChunksFromSegments(
  segments,
  options,
) {
  const allChunks = [];

  for (const segment of segments) {
    const pageChunks = chunkSegment(
      segment.text,
      segment.metadata,
      allChunks.length,
      options
    );
    allChunks.push(...pageChunks);
  }

  return allChunks;
}
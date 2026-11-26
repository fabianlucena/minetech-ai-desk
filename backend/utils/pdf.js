import { extractText, getDocumentProxy } from 'unpdf';
import { getBufferFromPath } from './get_buffer_from_path.js';

export async function extractPdfPages(buffer) {
  const bytes = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(bytes);

  try {
    const { text } = await extractText(pdf, { mergePages: false });
    const pagesText = Array.isArray(text) ? text : [text];

    return pagesText.map((pageText, index) => ({
      text: pageText ?? '',
      metadata: {
        fileType: 'pdf',
        page: index + 1,
      },
    }));
  } finally {
    await pdf?.cleanup?.();
    await pdf?.destroy?.();
  }
}

export async function extractPdfPagesFromPath(filePath) {
  const buffer = await getBufferFromPath(filePath);
  return await extractPdfPages(buffer);
}

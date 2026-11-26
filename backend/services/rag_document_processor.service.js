import { getDependency } from '../dependency.js';
import { getBufferFromPath } from '../utils/get_buffer_from_path.js';
import { extractPdfPagesFromPath } from '../utils/pdf.js';
import { buildChunksFromSegments } from '../utils/create_chunks.js';
import { extractByPath } from '../utils/extract_by_path.js';

export default class RagDocumentProcessorService {
  static isInited = false;
  static isProcessing = false;
  static logger;
  static ragDocumentService;
  static ragChunkService;

  static async init() {
    if (this.isInited)
      return;
    this.isInited = true;

    this.logger = getDependency('logger');
    this.ragDocumentService = getDependency('ragDocumentService');
    this.ragChunkService = getDependency('ragChunkService');

    await this.ragDocumentService.update(
      {
        status: 'pending',
        error: null,
      },
      { where: { status: 'processing' }},
    );

    this.exec();
  }

  static async exec() {
    if (this.isProcessing)
      return;
    this.isProcessing = true;

    let doc;
    do {
      try {
        doc = await this.ragDocumentService.getFirstOrDefault({ where: { status: 'pending' }, order: [[ 'createdAt', 'ASC' ]] });
        if (!doc)
          break;

        await this.processRagDocumentById(doc);
      } catch (err) {
        this.logger.error(`Error processing RAG documents: ${err.message}`);
        await this.ragDocumentService.updateById(
          doc.id,
          {
            status: 'error',
            error: err.message,
          }
        );
      }
    } while (doc);

    this.isProcessing = false;
  }

  static async processRagDocumentById(doc) {
    this.logger.info(`Processing RAG document ${doc.id}`);
    await this.ragDocumentService.updateById(doc.id, { status: 'processing' });

    await this.ragChunkService.deleteByWhere({ documentId: doc.id });

    let pages;
    if (doc.mimeType === 'text/plain') {
      const buffer = await getBufferFromPath(doc.filePath);
      const text = buffer.toString('utf-8');
      pages = [{ text, metadata: { fileType: 'text' } }];
    } else if (doc.mimeType === 'application/pdf') {
      pages = await extractPdfPagesFromPath(doc.filePath);
    } else {
      throw new Error(`Unsupported file type: ${doc.mimeType}`);
    }

    const totalChars = pages.reduce((acc, p) => acc + p.text.trim().length, 0);
    if (totalChars === 0)
      throw new Error('EMPTY_FILE');

    const chunks = buildChunksFromSegments(pages);

    for (const chunk of chunks) {
      const embedding = await this.embed(chunk.content);
      await this.ragChunkService.create({
        documentId: doc.id,
        index: chunk.index,
        content: chunk.content,
        metadata: chunk.metadata,
        embedding,
      });
    }

    await this.ragDocumentService.updateById(doc.id, { status: 'indexed' });
  }

  static async embed(text) {
    const config = getDependency('config');
    const response = await fetch(config.embed.url, {
      method: config.embed.method,
      headers: config.embed.headers,
      body: JSON.stringify({
        model: config.embed.model,
        input: text,
      }),
    });
    const data = await response.json();
    return extractByPath(data, config.embed.data);
  }
}
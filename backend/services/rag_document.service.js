import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export default class RagDocumentService extends ModelService {
  constructor() {
    super({
      model: getDependency('ragDocumentModel'),
      allowUuidForCreation: true,
    });
  }

  #path;
  get path() {
    if (!this.#path) {
      const config = getDependency('config');
      this.#path = config.ragDocumentsPath;
    }

    return this.#path;
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['uuid', 'isActive', 'fileName', 'filePath', 'mimeType', 'fileSize', 'checksum', 'status'];
  }

  get validPropertiesForUpdate() {
    return ['isActive', 'status'];
  }

  async create(data, options) {
    if (!data)
      throw new Error('No se ha proporcionado ningún dato para crear el documento RAG');

    data = { ...data };

    let saveFile = false;
    if (!data.filePath) {
      if (!data?.file)
        throw new Error('No se ha proporcionado ningún archivo para crear el documento RAG');

      saveFile = true;
      data.fileName ??= data.file.originalname;
      await this.addUniqueFileName(data);
      data.mimeType ??= data.file.mimetype;
      data.fileSize ??= data.file.size;
    }

    if (!data.fileName)
      throw new Error('No se ha proporcionado ningún nombre de archivo para crear el documento RAG');

    if (!data.mimeType)
      throw new Error('No se ha proporcionado ningún tipo de archivo para crear el documento RAG');

    try {
      if (saveFile)
        await fs.writeFile(data.filePath, data.file.buffer);

      data.checksum ??= await this.calculateChecksum(data.filePath);

      let doc = await this.getByChecksum(data.checksum, options);
      if (doc)
        throw new Error(`El documento ya está cargado en el sistema: ${doc.fileName} (${data.checksum})`);

      data.fileSize ??= await this.calculateFileSize(data.filePath);
      data.status ??= 'pending';

      delete data.file;
      return await super.create(data, options);
    } catch (err) {
      if (saveFile) {
        try {
          await fs.unlink(data.filePath);
        } catch (err2) {
          console.error(`Error al eliminar el archivo ${data.filePath}:`, err2);
        }
      }
      throw err;
    }
  }

  async addUniqueFileName(data) {
    const extension = path.extname(data.fileName);
    while(true) {
      data.uuid = crypto.randomUUID();
      let fileName = `${data.uuid}${extension}`;
      data.filePath = path.join(this.path, fileName);
      try {
        await fs.access(data.filePath);
      } catch (err) {
        if (err.code === 'ENOENT') {
          return;
        } else {
          throw err;
        }
      }
    }
  }

  async calculateChecksum(filePath) {
    const hash = crypto.createHash('sha256');
    const fileBuffer = await fs.readFile(filePath);
    hash.update(fileBuffer);
    return `SHA256:${hash.digest('hex')}`;
  }

  async calculateFileSize(filePath) {
    const stats = await fs.stat(filePath);
    return stats.size;
  }

  async getByChecksum(checksum, options) {
    if (!checksum)
      throw new Error('No se ha proporcionado ningún checksum para buscar el documento');

    return this.getFirstOrDefault({ ...options, where: { ...options?.where, checksum } });
  }
}
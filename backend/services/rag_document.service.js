import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RagDocumentService extends ModelService {
  constructor() {
    super({ model: getDependency('ragDocumentModel') });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['fileName', 'filePath', 'mimeType', 'fileSize', 'checksum', 'status'];
  }

  get validPropertiesForUpdate() {
    return ['status'];
  }
}
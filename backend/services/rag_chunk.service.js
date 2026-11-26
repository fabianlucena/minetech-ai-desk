import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RagChunkService extends ModelService {
  constructor() {
    super({
      model: getDependency('ragChunkModel'),  
      traceable: false,
      auditable: false,
      softDelete: false,
      useCreatedAt: true,
    });
  }

  getModelOptions(options) {
    options = super.getModelOptions(options);
    
    return options;
  }

  get validPropertiesForCreation() {
    return ['documentId', 'index', 'content', 'embedding', 'metadata'];
  }

  get validPropertiesForUpdate() {
    return ['embedding', 'metadata'];
  }
}
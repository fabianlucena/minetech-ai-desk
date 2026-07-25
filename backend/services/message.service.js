import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class MessageService extends ModelService {
  constructor() {
    super({ model: getDependency('messageModel') });
  }
}
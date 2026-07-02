import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class RoleService extends ModelService {
  constructor() {
    super({ model: getDependency('roleModel') });
  }
}
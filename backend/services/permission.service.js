import { getDependency } from '../dependency.js';
import ModelService from './model.service.js';

export default class PermissionService extends ModelService {
  constructor() {
    super({ model: getDependency('permissionModel') });
  }
}
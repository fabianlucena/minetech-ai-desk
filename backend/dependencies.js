import { addDependency } from './dependency.js';

import * as helloController from './controller/hello.controller.js';
import * as userController from './controller/user.controller.js';

import UserService from './services/user.service.js';

import { User } from './models/index.js';

addDependency('helloController', helloController);
addDependency('userController', userController);

addDependency('userModel', User);

addDependency('userService', UserService);

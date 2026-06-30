import { addDependency } from './dependency.js';

import * as helloController from './controller/hello.controller.js';
import * as userController from './controller/user.controller.js';
import * as loginController from './controller/login.controller.js';

import { User } from './models/index.js';

import UserService from './services/user.service.js';
import LoginService from './services/login.service.js';

addDependency('helloController', helloController);
addDependency('userController', userController);
addDependency('loginController', loginController);

addDependency('userModel', User);

addDependency('userService', UserService);
addDependency('loginService', LoginService);
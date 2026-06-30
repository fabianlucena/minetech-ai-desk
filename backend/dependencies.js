import { addDependency } from './dependency.js';
import config from './config.js';

import * as helloController from './controller/hello.controller.js';
import * as userController from './controller/user.controller.js';
import * as loginController from './controller/login.controller.js';

import * as models from './models/index.js';

import UserService from './services/user.service.js';
import UserPasswordService from './services/user_password.service.js';
import LoginService from './services/login.service.js';
import DeviceService from './services/device.service.js';
import SessionService from './services/session.service.js';

addDependency('config', config);

addDependency('helloController', () => helloController);
addDependency('userController', () => userController);
addDependency('loginController', () => loginController);

addDependency('userModel', () => models.User);
addDependency('userPasswordModel', () => models.UserPassword);
addDependency('deviceModel', () => models.Device);
addDependency('sessionModel', () => models.Session);

addDependency('userService', () => new UserService());
addDependency('userPasswordService', () => new UserPasswordService());
addDependency('loginService', () => new LoginService());
addDependency('deviceService', () => new DeviceService());
addDependency('sessionService', () => new SessionService());
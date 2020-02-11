import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverersController from './app/controllers/DeliverersController';
import FileController from './app/controllers/FileController';

import AuthMiddleware from './app/middlewares/Auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);

routes.get('/deliverers', DeliverersController.index);

export default routes;

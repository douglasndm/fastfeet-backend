import { Router } from 'express';

import multer from 'multer';
import multerConfing from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverersController from './app/controllers/DeliverersController';
import PackagesController from './app/controllers/PackagesController';
import FileController from './app/controllers/FileController';

import AuthMiddleware from './app/middlewares/Auth';
import Deliverer from './app/models/Deliverer';

const upload = multer(multerConfing);

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(AuthMiddleware);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);

routes.get('/deliverers', DeliverersController.index);
routes.post('/deliverers', DeliverersController.store);
routes.put('/deliverers/:id', DeliverersController.update);
routes.delete('/deliverers/:id', DeliverersController.delete);

routes.get('/packages', PackagesController.index);
routes.post('/packages', PackagesController.store);
routes.put('/packages', PackagesController.update);

routes.post('/files', upload.single('file'), (req, res) => {
    console.log(req.file);
    return res.json(req.file);
});

export default routes;

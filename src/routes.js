import { Router } from 'express';

import multer from 'multer';
import multerConfing from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverersController from './app/controllers/DeliverersController';
import PackagesController from './app/controllers/PackagesController';
import DeliverymanPackage from './app/controllers/DeliverymanPackage';
import DeliveryProblems from './app/controllers/DeliveryProblem';

import AuthMiddleware from './app/middlewares/Auth';

const upload = multer(multerConfing);

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:deliveryman_id/deliveries', PackagesController.index);
routes.put(
    '/deliveryman/:deliveryman_id/deliveries/:package_id',
    DeliverymanPackage.update
);

// ROTAS RELACIONADAS A PROBLEMAS COM ENTREGA
routes.get('/packages/:delivery_id/problems', DeliveryProblems.index);
routes.post('/packages/:delivery_id/problems', DeliveryProblems.store);
routes.delete('/packages/:delivery_id/problems', DeliveryProblems.delete);

routes.get('/deliverers/problems', DeliveryProblems.index);

routes.post('/files', upload.single('file'), (req, res) => {
    return res.json(req.file);
});

routes.use(AuthMiddleware);

routes.get('/users', UserController.index);
routes.post('/users', UserController.store);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverers', DeliverersController.index);
routes.post('/deliverers', DeliverersController.store);
routes.put('/deliverers/:id', DeliverersController.update);
routes.delete('/deliverers/:id', DeliverersController.delete);

routes.get('/packages', PackagesController.index);
routes.post('/packages', PackagesController.store);
routes.put('/packages/:id', PackagesController.update);
routes.delete('/packages/:id', PackagesController.delete);

export default routes;

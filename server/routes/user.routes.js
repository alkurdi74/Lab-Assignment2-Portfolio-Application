import controller from '../controllers/user.controller.js';
import { crudRoutes } from './crud.routes.js';
export default crudRoutes(controller, { publicCreate: true });

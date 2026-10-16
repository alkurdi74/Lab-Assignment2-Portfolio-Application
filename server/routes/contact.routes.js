import controller from '../controllers/contact.controller.js';
import { crudRoutes } from './crud.routes.js';
export default crudRoutes(controller, { publicCreate: true });

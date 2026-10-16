import controller from '../controllers/education.controller.js';
import { crudRoutes } from './crud.routes.js';
export default crudRoutes(controller, { publicRead: true });

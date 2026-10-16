import controller from '../controllers/project.controller.js';
import { crudRoutes } from './crud.routes.js';
export default crudRoutes(controller, { publicRead: true });

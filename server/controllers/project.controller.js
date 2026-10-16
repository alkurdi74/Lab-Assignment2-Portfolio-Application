import Model from '../models/project.model.js';
import { crud } from './crud.controller.js';
export default crud(Model, ["title","firstname","lastname","email","completion","description"]);

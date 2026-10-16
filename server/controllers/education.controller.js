import Model from '../models/education.model.js';
import { crud } from './crud.controller.js';
export default crud(Model, ["title","firstname","lastname","email","completion","description"]);

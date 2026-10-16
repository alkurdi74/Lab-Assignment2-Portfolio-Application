import Model from '../models/user.model.js';
import { crud } from './crud.controller.js';
export default crud(Model, ["name","email","password"]);

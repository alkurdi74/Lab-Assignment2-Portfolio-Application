import Model from '../models/contact.model.js';
import { crud } from './crud.controller.js';
export default crud(Model, ["firstname","lastname","email","phone","message"]);

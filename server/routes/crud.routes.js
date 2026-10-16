import { Router } from 'express';
import { requireSignin } from '../controllers/auth.controller.js';
export function crudRoutes(controller, { publicCreate = false, publicRead = false } = {}) {
  const router = Router();
  const read = publicRead ? [] : [requireSignin];
  router.route('/').get(...read, controller.list).post(...(publicCreate ? [] : [requireSignin]), controller.create).delete(requireSignin, controller.removeAll);
  router.route('/:id').get(...read, controller.read).put(requireSignin, controller.update).delete(requireSignin, controller.remove);
  return router;
}

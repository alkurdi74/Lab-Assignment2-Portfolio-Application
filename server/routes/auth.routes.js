import { Router } from 'express';
import { signin, signout, requireSignin } from '../controllers/auth.controller.js';
const router = Router();
router.post('/signin', signin);
router.post('/signout', requireSignin, signout);
router.get('/signout', requireSignin, signout);
export default router;

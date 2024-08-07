import express, { Router, Request, Response } from 'express';
import { userController } from '../../../controllers/v1/userController';

const router: Router = express.Router();
const { register } = userController();

router.post('/register', register);

export default router;

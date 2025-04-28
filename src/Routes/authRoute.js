import express from 'express';
import { login, generateRefreshToken } from '../Controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/token', generateRefreshToken)

export default router;
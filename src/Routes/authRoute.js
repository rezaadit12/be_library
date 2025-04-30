import express from 'express';
import { login, generateRefreshToken, logout } from '../Controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.post('/token', generateRefreshToken);
router.post('/logout', logout);

export default router;
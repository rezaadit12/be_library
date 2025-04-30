import express from 'express';
import { registerMember, verifyOtpCode, getAllMembers, getMemberById } from '../Controllers/memberController.js';

const router = express.Router();

router.post('/members/register', registerMember);
// router.post('/members/sendEmail', testSendEmail);
router.post('/members/verifyOtp', verifyOtpCode);
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberById);

export default router;
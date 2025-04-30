import express from 'express';
import { createLoan, getLoans, returnLoan } from '../Controllers/loanController.js';
import verifyToken from '../Middleware/verifyToken.js';
import authorizeRole from '../Middleware/authorizeRole.js';

const  router = express.Router();

// router.post('/loans/create', verifyToken, authorizeRole('admin'), createLoan);
router.post('/loans/create',createLoan);
router.get('/loans', getLoans);
router.put('/loans/return/:loan_id', returnLoan);   

export default router;

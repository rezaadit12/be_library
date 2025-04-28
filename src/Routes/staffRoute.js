import express from 'express';
import verifyToken from '../Middleware/verifyToken.js';
import authorizeRole from '../Middleware/authorizeRole.js';
import { getAllStaff, getStaffById, createNewStaff, updateStaff, deleteStaff } from '../Controllers/staffController.js';

const  router = express.Router();

router.get('/staff', getAllStaff);
router.get('/staff/:id', getStaffById);
router.post('/staff', verifyToken, authorizeRole("Admin"), createNewStaff);
router.patch('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

export default router;

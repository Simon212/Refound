import express from 'express';
import { getAllUsers, updateUserRole, deleteUser, getAllClaims, updateClaimStatus } from '../controllers/adminController.js';
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Alle Routes hier brauchen Admin-Rechte
router.use(verifyToken, isAdmin);

router.get('/users', getAllUsers);
router.put('/users/:userId/role', updateUserRole);
router.delete('/users/:userId', deleteUser);

router.get('/claims', getAllClaims);
router.put('/claims/:claimId/status', updateClaimStatus);

export default router;

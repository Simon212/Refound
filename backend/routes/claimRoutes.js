import express from 'express';
import { createClaim, getUserClaims } from '../controllers/claimController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createClaim);
router.get('/my', verifyToken, getUserClaims);

export default router;

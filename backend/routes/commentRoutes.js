import express from 'express';
import { getCommentsByItemId, addComment, deleteComment } from '../controllers/commentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/item/:itemId', getCommentsByItemId);
router.post('/item/:itemId', verifyToken, addComment);
router.delete('/:commentId', verifyToken, deleteComment);

export default router;

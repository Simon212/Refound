import express from 'express';
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);

// Protected routes
router.post('/', verifyToken, upload.single('image'), createItem);
router.put('/:id', verifyToken, upload.single('image'), updateItem);
router.delete('/:id', verifyToken, deleteItem);

export default router;

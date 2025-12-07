import express from 'express';
import * as salesController from '../controllers/salesController.js';

const router = express.Router();

router.get('/transactions', salesController.getSalesTransactions);
router.get('/filter-options', salesController.getFilterOptions);

export default router;


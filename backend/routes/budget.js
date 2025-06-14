const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middleware/auth'); // JWT or Firebase middleware

// Add budget item (income or expense)
router.post('/', authMiddleware, budgetController.addBudgetItem);

// Get all budget items of user
router.get('/', authMiddleware, budgetController.getBudgetItems);

// Get monthly summary (optional, can be implemented in controller)
router.get('/summary', authMiddleware, budgetController.getMonthlySummary);

// Delete budget item by ID
router.delete('/:id', authMiddleware, budgetController.deleteBudgetItem);

// Update budget item by ID
router.put('/:id', authMiddleware, budgetController.updateBudgetItem);


module.exports = router;

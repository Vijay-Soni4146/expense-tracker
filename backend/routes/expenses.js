const express = require('express');
const router = express.Router();
const ExpenseController = require('../controllers/expenseController');
const { validateQuery, validateParams, idParamSchema, paginationSchema } = require('../middleware/validation');

// GET /api/expenses - Get all expenses with filters
router.get('/', validateQuery(paginationSchema), ExpenseController.getAllExpenses);

// GET /api/expenses/:id - Get expense by ID
router.get('/:id', validateParams(idParamSchema), ExpenseController.getExpenseById);

// POST /api/expenses - Add new expense
router.post('/', ExpenseController.createExpense);

// PUT /api/expenses/:id - Update expense
router.put('/:id', validateParams(idParamSchema), ExpenseController.updateExpense);

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', validateParams(idParamSchema), ExpenseController.deleteExpense);

module.exports = router;
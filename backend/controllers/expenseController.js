const Expense = require("../models/Expense");
const User = require("../models/User");
const Category = require("../models/Category");
const Joi = require("joi");

// Validation schemas
const expenseSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  category_id: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().precision(2).required(),
  date: Joi.date().required(),
  description: Joi.string().max(500).allow("").optional(),
});

const updateExpenseSchema = Joi.object({
  user_id: Joi.number().integer().positive().optional(),
  category_id: Joi.number().integer().positive().optional(),
  amount: Joi.number().positive().precision(2).optional(),
  date: Joi.date().optional(),
  description: Joi.string().max(500).allow("").optional(),
});

class ExpenseController {
  // Get all expenses with filters
  static async getAllExpenses(req, res) {
    try {
      const filters = req.query;
      const result = await Expense.findAll(filters);

      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination,
      });
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch expenses",
        error: error.message,
      });
    }
  }

  // Get expense by ID
  static async getExpenseById(req, res) {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      res.status(200).json({
        success: true,
        data: expense,
      });
    } catch (error) {
      console.error("Error fetching expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch expense",
        error: error.message,
      });
    }
  }

  // Create new expense
  static async createExpense(req, res) {
    try {
      const { error, value } = expenseSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const { user_id, category_id } = value;

      // Verify user and category exist
      const userExists = await User.exists(user_id);
      const categoryExists = await Category.exists(category_id);

      if (!userExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const expense = await Expense.create(value);

      res.status(201).json({
        success: true,
        message: "Expense created successfully",
        data: expense,
      });
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to create expense",
        error: error.message,
      });
    }
  }

  // Update expense
  static async updateExpense(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateExpenseSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.details.map((detail) => detail.message),
        });
      }

      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      // Verify user and category exist if they're being updated
      if (value.user_id && !(await User.exists(value.user_id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
      }

      if (value.category_id && !(await Category.exists(value.category_id))) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const updatedExpense = await expense.update(value);

      res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        data: updatedExpense,
      });
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update expense",
        error: error.message,
      });
    }
  }

  // Delete expense
  static async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found",
        });
      }

      await expense.delete();

      res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete expense",
        error: error.message,
      });
    }
  }
}

module.exports = ExpenseController;

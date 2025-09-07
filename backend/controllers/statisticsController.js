const Expense = require("../models/Expense");

class StatisticsController {
  // Get top spending days for all users
  static async getTopSpendingDays(req, res) {
    try {
      const data = await Expense.getTopSpendingDays();

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Error fetching top spending days:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch top spending days statistics",
        error: error.message,
      });
    }
  }

  // Get monthly spending changes for all users
  static async getMonthlyChanges(req, res) {
    try {
      const data = await Expense.getMonthlyChanges();

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Error fetching monthly changes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch monthly changes statistics",
        error: error.message,
      });
    }
  }

  // Get spending predictions for all users
  static async getSpendingPredictions(req, res) {
    try {
      const data = await Expense.getSpendingPredictions();

      res.status(200).json({
        success: true,
        data: data,
      });
    } catch (error) {
      console.error("Error fetching spending predictions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch spending prediction statistics",
        error: error.message,
      });
    }
  }
}

module.exports = StatisticsController;

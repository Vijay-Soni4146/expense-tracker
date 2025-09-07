const db = require("../config/database");

class Expense {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.category_id = data.category_id;
    this.amount = data.amount;
    this.date = data.date;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.user_name = data.user_name;
    this.category_name = data.category_name;
  }

  // Get all expenses with filters and pagination
  static async findAll(filters = {}) {
    try {
      const {
        user_id,
        category_id,
        start_date,
        end_date,
        page = 1,
        limit = 10,
      } = filters;

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;

      let query = `
        SELECT e.*, u.name as user_name, c.name as category_name
        FROM expenses e
        JOIN users u ON e.user_id = u.id
        JOIN categories c ON e.category_id = c.id
      `;
      const params = [];

      if (user_id) {
        query += " AND e.user_id = ?";
        params.push(user_id);
      }

      if (category_id) {
        query += " AND e.category_id = ?";
        params.push(category_id);
      }

      if (start_date) {
        query += " AND e.date >= ?";
        params.push(start_date);
      }

      if (end_date) {
        query += " AND e.date <= ?";
        params.push(end_date);
      }

      query += " ORDER BY e.date DESC, e.created_at DESC";

      // Add pagination
      const offset = (pageNum - 1) * limitNum;
      query += ` LIMIT ${limitNum} OFFSET ${offset}`;

      const result = await db.execute(query, params);
      const expenses = result[0];

      // Get total count for pagination
      let countQuery = `
        SELECT COUNT(*) as total
        FROM expenses e
        JOIN users u ON e.user_id = u.id
        JOIN categories c ON e.category_id = c.id
      `;
      const countParams = [];

      if (user_id) {
        countQuery += " AND e.user_id = ?";
        countParams.push(user_id);
      }

      if (category_id) {
        countQuery += " AND e.category_id = ?";
        countParams.push(category_id);
      }

      if (start_date) {
        countQuery += " AND e.date >= ?";
        countParams.push(start_date);
      }

      if (end_date) {
        countQuery += " AND e.date <= ?";
        countParams.push(end_date);
      }

      const countResult = await db.execute(countQuery, countParams);
      const total = countResult[0][0].total;

      return {
        expenses: expenses.map((expense) => new Expense(expense)),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch expenses: ${error.message}`);
    }
  }

  // Find expense by ID
  static async findById(id) {
    try {
      const result = await db.execute(
        `
        SELECT e.*, u.name as user_name, c.name as category_name
        FROM expenses e
        JOIN users u ON e.user_id = u.id
        JOIN categories c ON e.category_id = c.id
        WHERE e.id = ?
      `,
        [id]
      );
      const expenses = result[0];

      return expenses.length > 0 ? new Expense(expenses[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find expense: ${error.message}`);
    }
  }

  // Create new expense
  static async create(expenseData) {
    try {
      const { user_id, category_id, amount, date, description } = expenseData;

      // Ensure all required fields are present and valid
      if (!user_id || !category_id || !amount || !date) {
        throw new Error(
          "Missing required fields: user_id, category_id, amount, and date are required"
        );
      }

      const result = await db.execute(
        "INSERT INTO expenses (user_id, category_id, amount, date, description) VALUES (?, ?, ?, ?, ?)",
        [user_id, category_id, amount, date, description || null]
      );

      // Check if insertId exists
      const insertId = result[0].insertId;
      if (!insertId) {
        throw new Error("Failed to get insert ID from database");
      }

      const newExpense = await Expense.findById(insertId);
      return newExpense;
    } catch (error) {
      throw new Error(`Failed to create expense: ${error.message}`);
    }
  }

  // Update expense
  async update(expenseData) {
    try {
      const updates = [];
      const params = [];

      Object.keys(expenseData).forEach((key) => {
        if (
          ["user_id", "category_id", "amount", "date", "description"].includes(
            key
          )
        ) {
          updates.push(`${key} = ?`);
          params.push(expenseData[key]);
        }
      });

      if (updates.length === 0) {
        throw new Error("No valid fields to update");
      }

      params.push(this.id);

      await db.execute(
        `UPDATE expenses SET ${updates.join(", ")} WHERE id = ?`,
        params
      );

      Object.assign(this, expenseData);

      // Refresh with joined data
      const updatedExpense = await Expense.findById(this.id);
      return updatedExpense;
    } catch (error) {
      throw new Error(`Failed to update expense: ${error.message}`);
    }
  }

  // Delete expense
  async delete() {
    try {
      const result = await db.execute("DELETE FROM expenses WHERE id = ?", [
        this.id,
      ]);
      return result[0].affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete expense: ${error.message}`);
    }
  }

  // Get top spending days for all users
  static async getTopSpendingDays() {
    try {
      const query = `
        WITH daily_spending AS (
          SELECT
            e.user_id,
            u.name as user_name,
            e.date,
            SUM(e.amount) as daily_total
          FROM expenses e
          JOIN users u ON e.user_id = u.id
          GROUP BY e.user_id, u.name, e.date
        ),
        ranked_days AS (
          SELECT
            user_id,
            user_name,
            date,
            daily_total,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY daily_total DESC) as rank_num
          FROM daily_spending
        )
        SELECT
          user_id,
          user_name,
          date,
          daily_total
        FROM ranked_days
        WHERE rank_num <= 3
        ORDER BY user_id, daily_total DESC
      `;

      const results = await db.execute(query);

      // Group results by user
      const groupedResults = results[0].reduce((acc, row) => {
        if (!acc[row.user_id]) {
          acc[row.user_id] = {
            user_id: row.user_id,
            user_name: row.user_name,
            top_days: [],
          };
        }
        acc[row.user_id].top_days.push({
          date: row.date,
          daily_total: parseFloat(row.daily_total),
        });
        return acc;
      }, {});

      return Object.values(groupedResults);
    } catch (error) {
      throw new Error(`Failed to get top spending days: ${error.message}`);
    }
  }

  // Get monthly spending changes for all users
  static async getMonthlyChanges() {
    try {
      const query = `
        WITH monthly_spending AS (
          SELECT
            e.user_id,
            u.name as user_name,
            YEAR(e.date) as year,
            MONTH(e.date) as month,
            SUM(e.amount) as monthly_total
          FROM expenses e
          JOIN users u ON e.user_id = u.id
          GROUP BY e.user_id, u.name, YEAR(e.date), MONTH(e.date)
        ),
        monthly_with_previous AS (
          SELECT
            user_id,
            user_name,
            year,
            month,
            monthly_total,
            LAG(monthly_total) OVER (PARTITION BY user_id ORDER BY year, month) as previous_month_total
          FROM monthly_spending
        )
        SELECT
          user_id,
          user_name,
          year,
          month,
          monthly_total,
          previous_month_total,
          CASE
            WHEN previous_month_total IS NULL THEN NULL
            WHEN previous_month_total = 0 THEN
              CASE WHEN monthly_total > 0 THEN 100 ELSE 0 END
            ELSE ROUND(((monthly_total - previous_month_total) / previous_month_total) * 100, 2)
          END as percentage_change
        FROM monthly_with_previous
        WHERE previous_month_total IS NOT NULL
        ORDER BY user_id, year DESC, month DESC
      `;

      const results = await db.execute(query);

      // Group results by user
      const groupedResults = results[0].reduce((acc, row) => {
        if (!acc[row.user_id]) {
          acc[row.user_id] = {
            user_id: row.user_id,
            user_name: row.user_name,
            monthly_changes: [],
          };
        }
        acc[row.user_id].monthly_changes.push({
          year: row.year,
          month: row.month,
          monthly_total: parseFloat(row.monthly_total),
          previous_month_total: parseFloat(row.previous_month_total),
          percentage_change: row.percentage_change,
        });
        return acc;
      }, {});

      return Object.values(groupedResults);
    } catch (error) {
      throw new Error(`Failed to get monthly changes: ${error.message}`);
    }
  }

  // Get spending predictions for all users
  static async getSpendingPredictions() {
    try {
      const query = `
        WITH monthly_spending AS (
          SELECT
            e.user_id,
            u.name as user_name,
            YEAR(e.date) as year,
            MONTH(e.date) as month,
            SUM(e.amount) as monthly_total
          FROM expenses e
          JOIN users u ON e.user_id = u.id
          GROUP BY e.user_id, u.name, YEAR(e.date), MONTH(e.date)
        ),
        recent_months AS (
          SELECT
            user_id,
            user_name,
            year,
            month,
            monthly_total,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY year DESC, month DESC) as month_rank
          FROM monthly_spending
        ),
        last_3_months AS (
          SELECT
            user_id,
            user_name,
            AVG(monthly_total) as avg_last_3_months,
            COUNT(*) as months_count
          FROM recent_months
          WHERE month_rank <= 3
          GROUP BY user_id, user_name
        )
        SELECT
          user_id,
          user_name,
          ROUND(avg_last_3_months, 2) as avg_last_3_months,
          months_count,
          ROUND(avg_last_3_months, 2) as predicted_next_month
        FROM last_3_months
        ORDER BY user_id
      `;

      const results = await db.execute(query);

      // Get the actual last 3 months data
      const detailQuery = `
        WITH monthly_spending AS (
          SELECT
            e.user_id,
            u.name as user_name,
            YEAR(e.date) as year,
            MONTH(e.date) as month,
            SUM(e.amount) as monthly_total
          FROM expenses e
          JOIN users u ON e.user_id = u.id
          GROUP BY e.user_id, u.name, YEAR(e.date), MONTH(e.date)
        ),
        recent_months AS (
          SELECT
            user_id,
            user_name,
            year,
            month,
            monthly_total,
            ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY year DESC, month DESC) as month_rank
          FROM monthly_spending
        )
        SELECT
          user_id,
          user_name,
          year,
          month,
          monthly_total
        FROM recent_months
        WHERE month_rank <= 3
        ORDER BY user_id, year DESC, month DESC
      `;

      const detailResults = await db.execute(detailQuery);

      // Group detail results by user
      const detailsByUser = detailResults[0].reduce((acc, row) => {
        if (!acc[row.user_id]) {
          acc[row.user_id] = [];
        }
        acc[row.user_id].push({
          year: row.year,
          month: row.month,
          monthly_total: parseFloat(row.monthly_total),
        });
        return acc;
      }, {});

      // Combine results with details
      const finalResults = results[0].map((row) => ({
        user_id: row.user_id,
        user_name: row.user_name,
        avg_last_3_months: parseFloat(row.avg_last_3_months),
        months_count: row.months_count,
        predicted_next_month: parseFloat(row.predicted_next_month),
        last_3_months_detail: detailsByUser[row.user_id] || [],
      }));

      return finalResults;
    } catch (error) {
      throw new Error(`Failed to get spending predictions: ${error.message}`);
    }
  }
}

module.exports = Expense;

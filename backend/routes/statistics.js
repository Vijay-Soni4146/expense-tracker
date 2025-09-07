const express = require('express');
const router = express.Router();
const StatisticsController = require('../controllers/statisticsController');

// Statistics 1: Find each user's top 3 days (by total expenditure), ordered by the total amount spent
router.get('/top-spending-days', StatisticsController.getTopSpendingDays);

// Statistics 2: Calculate the percentage change in total expenditure from the previous month for each user
router.get('/monthly-change', StatisticsController.getMonthlyChanges);

// Statistics 3: Predict the next month's total expenditure based on the average spending of the last 3 months
router.get('/spending-prediction', StatisticsController.getSpendingPredictions);

module.exports = router;
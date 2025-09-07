import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  PieChart,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { useCategories, useUsers } from "../hooks/useApi";
import { fetchDashboardExpenses } from "../store/slices/expenseSlice";
import {
  fetchMonthlyChanges,
  fetchSpendingPredictions,
  fetchTopSpendingDays,
  refreshAllStatistics,
} from "../store/slices/statisticsSlice";
import { setShowExpenseForm } from "../store/slices/uiSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardExpenses, dashboardLoading } = useSelector(
    (state) => state.expenses
  );
  const {
    topSpendingDays,
    monthlyChanges,
    spendingPredictions,
    loading: statsLoading,
  } = useSelector((state) => state.statistics);
  const { users } = useUsers();
  const { categories } = useCategories();

  useEffect(() => {
    if (dashboardExpenses.length === 0) {
      dispatch(fetchDashboardExpenses(100));
    }
    if (topSpendingDays.length === 0) {
      dispatch(fetchTopSpendingDays());
    }
    if (monthlyChanges.length === 0) {
      dispatch(fetchMonthlyChanges());
    }
    if (spendingPredictions.length === 0) {
      dispatch(fetchSpendingPredictions());
    }
  }, [
    dispatch,
    dashboardExpenses.length,
    topSpendingDays.length,
    monthlyChanges.length,
    spendingPredictions.length,
  ]);
  useEffect(() => {
    dispatch(refreshAllStatistics());
  }, [dispatch]);

  // Memoize expensive calculations
  const dashboardMetrics = useMemo(() => {
    const totalExpenses = dashboardExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const lastMonth = new Date(thisYear, thisMonth - 1);

    const thisMonthExpenses = dashboardExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === thisMonth &&
        expenseDate.getFullYear() === thisYear
      );
    });
    const thisMonthTotal = thisMonthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const lastMonthExpenses = dashboardExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === lastMonth.getMonth() &&
        expenseDate.getFullYear() === lastMonth.getFullYear()
      );
    });
    const lastMonthTotal = lastMonthExpenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0
    );

    const monthlyChange =
      lastMonthTotal > 0
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
        : 0;

    return {
      totalExpenses,
      thisMonthTotal,
      monthlyChange,
    };
  }, [dashboardExpenses]);

  // Memoize category breakdown
  const categoryTotals = useMemo(() => {
    return categories
      .map((category) => {
        const categoryExpenses = dashboardExpenses.filter(
          (expense) => expense.category_id === category.id
        );
        const total = categoryExpenses.reduce(
          (sum, expense) => sum + Number(expense.amount),
          0
        );
        return { name: category.name, total, count: categoryExpenses.length };
      })
      .sort((a, b) => b.total - a.total);
  }, [categories, dashboardExpenses]);

  // Memoize recent expenses
  const recentExpenses = useMemo(
    () => dashboardExpenses.slice(0, 5),
    [dashboardExpenses]
  );

  const handleAddExpense = () => {
    dispatch(setShowExpenseForm(true));
  };

  const handleViewExpenses = () => {
    navigate("/expenses");
  };

  const handleViewStatistics = () => {
    navigate("/statistics");
  };

  if (dashboardLoading || statsLoading.topSpendingDays) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to your expense tracking dashboard
          </p>
        </div>
        <button
          onClick={handleAddExpense}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-600">₹</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{dashboardMetrics.totalExpenses.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{dashboardMetrics.thisMonthTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Categories</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Expenses
              </h2>
              <button
                onClick={handleViewExpenses}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
              >
                View All
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-4">
              {recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-blue-600">₹</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {expense.description || expense.category_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.user_name} •{" "}
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{Number(expense.amount).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {expense.category_name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Top Categories
            </h2>
            <div className="space-y-4">
              {categoryTotals.slice(0, 6).map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        index === 0
                          ? "bg-blue-500"
                          : index === 1
                          ? "bg-green-500"
                          : index === 2
                          ? "bg-yellow-500"
                          : index === 3
                          ? "bg-purple-500"
                          : index === 4
                          ? "bg-pink-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      ₹{Number(category.total).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.count} expenses
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Top Spending Days
            </h2>
            <button
              onClick={handleViewStatistics}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              View Details
              <BarChart3 className="h-4 w-4 ml-1" />
            </button>
          </div>
          {topSpendingDays.slice(0, 2).map((userData) => (
            <div
              key={userData.user_id}
              className="mb-4"
            >
              <h3 className="font-medium text-gray-900 mb-2">
                {userData.user_name}
              </h3>
              <div className="space-y-2">
                {userData.top_days.slice(0, 2).map((day, index) => (
                  <div
                    key={`${day.date}-${index}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-600">
                      {new Date(day.date).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-gray-900">
                      ₹{Number(day.daily_total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Next Month Predictions
            </h2>
            <button
              onClick={handleViewStatistics}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
            >
              View Details
              <TrendingUp className="h-4 w-4 ml-1" />
            </button>
          </div>
          {spendingPredictions.slice(0, 3).map((userData) => (
            <div
              key={userData.user_id}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-3"
            >
              <div>
                <p className="font-medium text-gray-900">
                  {userData.user_name}
                </p>
                <p className="text-sm text-gray-600">
                  Based on {userData.months_count} months
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">
                  ₹{Number(userData.predicted_next_month).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">predicted</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMonthlyChanges } from "../../store/slices/statisticsSlice";
import LoadingSpinner from "../UI/LoadingSpinner";

const MonthlyChanges = () => {
  const dispatch = useDispatch();
  const { monthlyChanges, loading } = useSelector((state) => state.statistics);

  useEffect(() => {
    if (monthlyChanges.length === 0) {
      dispatch(fetchMonthlyChanges());
    }
  }, [dispatch, monthlyChanges.length]);

  const getMonthName = (month) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1];
  };

  const getChangeIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const getChangeColor = (change) => {
    if (change > 0) return "text-green-600 bg-green-50";
    if (change < 0) return "text-red-600 bg-red-50";
    return "text-gray-600 bg-gray-50";
  };

  if (loading.monthlyChanges) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
          <TrendingUp className="h-5 w-5 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Monthly Spending Changes
        </h2>
      </div>

      <div className="space-y-6">
        {monthlyChanges.map((userData) => (
          <div
            key={userData.user_id}
            className="border-l-4 border-green-500 pl-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {userData.user_name}
            </h3>
            <div className="space-y-2">
              {userData.monthly_changes.slice(0, 6).map((change, index) => (
                <div
                  key={`${change.year}-${change.month}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">
                      {getMonthName(change.month)} {change.year}
                    </span>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(change.percentage_change)}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getChangeColor(
                          change.percentage_change
                        )}`}
                      >
                        {change.percentage_change > 0 ? "+" : ""}
                        {change.percentage_change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      ₹{Number(change.monthly_total).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      vs ₹{Number(change.previous_month_total).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {monthlyChanges.length === 0 && (
        <div className="text-center py-8">
          <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No data available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add expenses across multiple months to see changes.
          </p>
        </div>
      )}
    </div>
  );
};

export default MonthlyChanges;

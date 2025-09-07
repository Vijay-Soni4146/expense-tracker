import { Calendar, Italic as Crystal } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpendingPredictions } from "../../store/slices/statisticsSlice";
import LoadingSpinner from "../UI/LoadingSpinner";

const SpendingPredictions = () => {
  const dispatch = useDispatch();
  const { spendingPredictions, loading } = useSelector(
    (state) => state.statistics
  );

  useEffect(() => {
    if (spendingPredictions.length === 0) {
      dispatch(fetchSpendingPredictions());
    }
  }, [dispatch, spendingPredictions.length]);

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

  if (loading.spendingPredictions) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <Crystal className="h-5 w-5 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Next Month Spending Predictions
        </h2>
      </div>

      <div className="space-y-6">
        {spendingPredictions.map((userData) => (
          <div
            key={userData.user_id}
            className="border-l-4 border-purple-500 pl-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {userData.user_name}
            </h3>
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 font-medium">
                    Predicted Next Month
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    ₹{Number(userData.predicted_next_month).toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-purple-700">
                    Based on {userData.months_count} months
                  </p>
                  <p className="text-sm text-purple-600">
                    Avg: ₹{Number(userData.avg_last_3_months).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Last 3 Months Data:
              </h4>
              {userData.last_3_months_detail.map((month, index) => (
                <div
                  key={`${month.year}-${month.month}`}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {getMonthName(month.month)} {month.year}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{Number(month.monthly_total).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {spendingPredictions.length === 0 && (
        <div className="text-center py-8">
          <Crystal className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No predictions available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add expenses across multiple months to see predictions.
          </p>
        </div>
      )}
    </div>
  );
};

export default SpendingPredictions;

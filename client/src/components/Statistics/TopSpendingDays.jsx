import { format } from "date-fns";
import { Calendar, TrendingUp } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopSpendingDays } from "../../store/slices/statisticsSlice";
import LoadingSpinner from "../UI/LoadingSpinner";

const TopSpendingDays = () => {
  const dispatch = useDispatch();
  const { topSpendingDays, loading } = useSelector((state) => state.statistics);

  useEffect(() => {
    if (topSpendingDays.length === 0) {
      dispatch(fetchTopSpendingDays());
    }
  }, [dispatch, topSpendingDays.length]);

  if (loading.topSpendingDays) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <TrendingUp className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Top 3 Spending Days by User
        </h2>
      </div>

      <div className="space-y-6">
        {topSpendingDays.map((userData) => (
          <div
            key={userData.user_id}
            className="border-l-4 border-blue-500 pl-4"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-3">
              {userData.user_name}
            </h3>
            <div className="space-y-2">
              {userData.top_days.map((day, index) => (
                <div
                  key={`${day.date}-${index}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {format(new Date(day.date), "MMM dd, yyyy")}
                    </span>
                    <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      #{index + 1}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    ₹{Number(day.daily_total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {topSpendingDays.length === 0 && (
        <div className="text-center py-8">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No data available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Add some expenses to see top spending days.
          </p>
        </div>
      )}
    </div>
  );
};

export default TopSpendingDays;

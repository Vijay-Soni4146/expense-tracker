import { useEffect } from "react";
import { useDispatch } from "react-redux";
import MonthlyChanges from "../components/Statistics/MonthlyChanges";
import SpendingPredictions from "../components/Statistics/SpendingPredictions";
import TopSpendingDays from "../components/Statistics/TopSpendingDays";
import { refreshAllStatistics } from "../store/slices/statisticsSlice";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(refreshAllStatistics());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistics</h1>
        <p className="text-gray-600">
          Analyze your spending patterns and trends
        </p>
      </div>
      <div className="space-y-8">
        <TopSpendingDays />
        <MonthlyChanges />
        <SpendingPredictions />
      </div>
    </div>
  );
};

export default StatisticsPage;

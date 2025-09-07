import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import ExpensesPage from "../pages/ExpensesPage";
import StatisticsPage from "../pages/StatisticsPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<Dashboard />}
      />
      <Route
        path="/dashboard"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
      <Route
        path="/expenses"
        element={<ExpensesPage />}
      />
      <Route
        path="/statistics"
        element={<StatisticsPage />}
      />
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;

import { Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import DeleteExpenseModal from "../components/Expenses/DeleteExpenseModal.jsx";
import ExpenseFilters from "../components/Expenses/ExpenseFilters.jsx";
import ExpenseList from "../components/Expenses/ExpenseList.jsx";
import { setShowExpenseForm } from "../store/slices/uiSlice.js";

const ExpensesPage = () => {
  const dispatch = useDispatch();

  const handleAddExpense = () => {
    dispatch(setShowExpenseForm(true));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-gray-600">Manage and track your expenses</p>
        </div>
        <button
          onClick={handleAddExpense}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>
      <ExpenseFilters />
      <ExpenseList />
      <DeleteExpenseModal />
    </div>
  );
};

export default ExpensesPage;

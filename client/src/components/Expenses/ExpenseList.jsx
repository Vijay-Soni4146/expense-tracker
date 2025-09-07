import { format } from "date-fns";
import { Calendar, Edit2, Tag, Trash2, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenses } from "../../store/slices/expenseSlice";
import {
  setDeletingExpense,
  setEditingExpense,
} from "../../store/slices/uiSlice";
import { apiGuards } from "../../utils/apiGuards";
import LoadingSpinner from "../UI/LoadingSpinner";

const ExpenseList = () => {
  const dispatch = useDispatch();
  const { expenses, loading, pagination, filters } = useSelector(
    (state) => state.expenses
  );
  const previousFilters = useRef(filters);
  const hasInitialFetch = useRef(false);

  useEffect(() => {
    const filtersChanged =
      JSON.stringify(filters) !== JSON.stringify(previousFilters.current);

    if (filtersChanged) {
      previousFilters.current = filters;
      dispatch(fetchExpenses(filters));
    } else if (!hasInitialFetch.current && expenses.length === 0 && !loading) {
      hasInitialFetch.current = true;
      dispatch(fetchExpenses(filters));
    }
  }, [dispatch, filters, expenses.length, loading]);

  useEffect(() => {
    return () => {
      apiGuards.clearAll();
    };
  }, []);

  const handleEdit = (expenseId) => {
    dispatch(setEditingExpense(expenseId));
  };

  const handleDelete = (expenseId) => {
    dispatch(setDeletingExpense(expenseId));
  };

  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    dispatch(fetchExpenses(newFilters));
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <span className="mx-auto text-6xl text-gray-400">₹</span>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No expenses found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding a new expense.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 mr-1" />
                  {expense.user_name}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Tag className="h-4 w-4 mr-1" />
                  {expense.category_name}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  {format(new Date(expense.date), "MMM dd, yyyy")}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{Number(expense.amount).toFixed(2)}
                  </div>
                  {expense.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {expense.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(expense.id)}
                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit expense"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.total}</span>{" "}
                results
              </p>
            </div>
            <div>
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                  {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.pages}
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;

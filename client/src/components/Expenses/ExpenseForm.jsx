import {
  Calendar,
  FileText,
  Loader2,
  Tag,
  User,
  X
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useCategories, useUsers } from "../../hooks/useApi";
import {
  createExpense,
  fetchExpenses,
  updateExpense,
} from "../../store/slices/expenseSlice";
import {
  showErrorToast,
  showSuccessToast,
} from "../../store/slices/toastSlice";
import { setShowExpenseForm } from "../../store/slices/uiSlice";

const ExpenseForm = () => {
  const dispatch = useDispatch();
  const { showExpenseForm, editingExpense } = useSelector((state) => state.ui);
  const { expenses, filters } = useSelector((state) => state.expenses);
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const editingExpenseData = editingExpense
    ? expenses.find((expense) => expense.id === editingExpense)
    : null;

  useEffect(() => {
    if (editingExpenseData) {
      setValue("user_id", editingExpenseData.user_id);
      setValue("category_id", editingExpenseData.category_id);
      setValue("amount", editingExpenseData.amount);
      const dateValue = editingExpenseData.date
        ? new Date(editingExpenseData.date).toISOString().split("T")[0]
        : "";
      setValue("date", dateValue);

      setValue("description", editingExpenseData.description || "");
    } else {
      reset();
      setValue("date", getTodayDate());
    }
  }, [editingExpenseData, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (editingExpense) {
        await dispatch(updateExpense({ id: editingExpense, data }));
        dispatch(
          showSuccessToast(
            "Expense Updated",
            "The expense has been successfully updated.",
            4000
          )
        );
      } else {
        await dispatch(createExpense(data));
        dispatch(
          showSuccessToast(
            "Expense Created",
            "The expense has been successfully created.",
            4000
          )
        );
      }

      dispatch(setShowExpenseForm(false));
      dispatch(fetchExpenses(filters));
      reset();
    } catch (error) {
      console.error("Error saving expense:", error);
      dispatch(
        showErrorToast(
          "Save Failed",
          "Failed to save the expense. Please try again.",
          5000
        )
      );
    }
  };

  const handleClose = () => {
    dispatch(setShowExpenseForm(false));
    reset();
  };
  if (!showExpenseForm) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />

        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-white">₹</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {editingExpense ? "Edit Expense" : "Add New Expense"}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {editingExpense
                      ? "Update expense details"
                      : "Enter expense information"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-white hover:bg-opacity-10 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
          <div className="bg-white px-6 py-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="user_id"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <User className="inline h-4 w-4 mr-2" />
                  User <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("user_id", {
                      required: "User is required",
                      valueAsNumber: true,
                    })}
                    disabled={usersLoading}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed pl-4 pr-10 py-3 border-2 transition-colors"
                  >
                    <option value="">
                      {usersLoading ? "Loading users..." : "Select a user"}
                    </option>
                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
                {usersError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    Error loading users: {usersError}
                  </p>
                )}
                {errors.user_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    {errors.user_id.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <Tag className="inline h-4 w-4 mr-2" />
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register("category_id", {
                      required: "Category is required",
                      valueAsNumber: true,
                    })}
                    disabled={categoriesLoading}
                    className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed pl-4 pr-10 py-3 border-2 transition-colors"
                  >
                    <option value="">
                      {categoriesLoading
                        ? "Loading categories..."
                        : "Select a category"}
                    </option>
                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {categoriesError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    Error loading categories: {categoriesError}
                  </p>
                )}
                {errors.category_id && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    {errors.category_id.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <span className="text-lg font-bold mr-2">₹</span>
                  Amount <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-lg font-semibold">
                      ₹
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("amount", {
                      required: "Amount is required",
                      min: {
                        value: 0.01,
                        message: "Amount must be greater than 0",
                      },
                      validate: (value) => {
                        if (value && value.toString().includes(".")) {
                          const decimalPart = value.toString().split(".")[1];
                          if (decimalPart && decimalPart.length > 2) {
                            return "Amount can have maximum 2 decimal places";
                          }
                        }
                        return true;
                      },
                      valueAsNumber: true,
                    })}
                    onInput={(e) => {
                      const value = e.target.value;
                      if (value.includes(".")) {
                        const parts = value.split(".");
                        if (parts[1] && parts[1].length > 2) {
                          e.target.value =
                            parts[0] + "." + parts[1].substring(0, 2);
                        }
                      }
                    }}
                    className="block w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
                    placeholder="0.00"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    {errors.amount.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <Calendar className="inline h-4 w-4 mr-2" />
                  Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    max={getTodayDate()}
                    {...register("date", {
                      required: "Date is required",
                      validate: (value) => {
                        const selectedDate = new Date(value);
                        const today = new Date();
                        today.setHours(23, 59, 59, 999);
                        if (selectedDate > today) {
                          return "Date cannot be in the future";
                        }
                        return true;
                      },
                    })}
                    className="block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition-colors"
                    style={{
                      colorScheme: "light",
                    }}
                    onFocus={(e) => {
                      e.target.style.color = "#000";
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        e.target.style.color = "#9CA3AF";
                      }
                    }}
                  />
                  <div
                    className="absolute inset-0 flex items-center px-4 pointer-events-none text-gray-400"
                    style={{ display: "none" }}
                    id="date-placeholder"
                  >
                    Select date
                  </div>
                </div>
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="mr-2"></span>
                    {errors.date.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  <FileText className="inline h-4 w-4 mr-2" />
                  Description
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="block w-full rounded-xl border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 px-4 transition-colors resize-none"
                  placeholder="Optional description..."
                />
              </div>
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">₹</span>
                      {editingExpense ? "Update Expense" : "Create Expense"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;

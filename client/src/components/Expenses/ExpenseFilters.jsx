import { Filter, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useCategories, useUsers } from "../../hooks/useApi";
import { clearFilters, setFilters } from "../../store/slices/expenseSlice";

const ExpenseFilters = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.expenses);
  const { users } = useUsers();
  const { categories } = useCategories();
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters };

    if (value === "" || value === "all") {
      newFilters[key] = undefined;
    } else {
      if (key === "start_date" || key === "end_date") {
        if (
          !value ||
          value.length !== 10 ||
          !value.match(/^\d{4}-\d{2}-\d{2}$/)
        ) {
          return;
        }

        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (selectedDate > today) {
          return;
        }
      }

      newFilters[key] = key.includes("_id") ? parseInt(value) : value;
    }
    newFilters.page = 1;

    dispatch(setFilters(newFilters));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = Object.keys(filters).some(
    (key) => key !== "page" && key !== "limit" && filters[key]
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            htmlFor="user-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            User
          </label>
          <select
            id="user-filter"
            key={`user-${filters.user_id || "all"}`}
            value={filters.user_id || ""}
            onChange={(e) => handleFilterChange("user_id", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All users</option>
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
        <div>
          <label
            htmlFor="category-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            key={`category-${filters.category_id || "all"}`}
            value={filters.category_id || ""}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All categories</option>
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
        <div>
          <label
            htmlFor="start-date-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start-date-filter"
            max={getTodayDate()}
            value={filters.start_date || ""}
            onChange={(e) => handleFilterChange("start_date", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="end-date-filter"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <input
            type="date"
            id="end-date-filter"
            max={getTodayDate()}
            value={filters.end_date || ""}
            onChange={(e) => handleFilterChange("end_date", e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default ExpenseFilters;

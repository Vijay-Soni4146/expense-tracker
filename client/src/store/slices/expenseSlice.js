import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { expenseAPI } from "../../services/api";
import { apiGuards, createGuardKey } from "../../utils/apiGuards";
import { refreshAllStatistics } from "./statisticsSlice";

const initialState = {
  expenses: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    page: 1,
    limit: 10,
  },
  dashboardExpenses: [],
  dashboardLoading: false,
};

export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (filters = {}) => {
    const guardKey = createGuardKey("expenses", filters);
    if (apiGuards.isCallInProgress(guardKey)) {
      console.log("API call already in progress, skipping...");
      return {
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      };
    }

    apiGuards.startCall(guardKey);

    try {
      const response = await expenseAPI.getExpenses(filters);
      return response.data;
    } finally {
      apiGuards.completeCall(guardKey);
    }
  }
);

export const fetchDashboardExpenses = createAsyncThunk(
  "expenses/fetchDashboardExpenses",
  async (limit = 100) => {
    const guardKey = createGuardKey("dashboardExpenses", { limit });
    if (apiGuards.isCallInProgress(guardKey)) {
      throw new Error("API call already in progress");
    }

    apiGuards.startCall(guardKey);

    try {
      const response = await expenseAPI.getExpenses({ limit });
      return response.data;
    } finally {
      apiGuards.completeCall(guardKey);
    }
  }
);

export const createExpense = createAsyncThunk(
  "expenses/createExpense",
  async (expenseData, { dispatch }) => {
    const response = await expenseAPI.createExpense(expenseData);
    // Refresh statistics after creating expense
    dispatch(refreshAllStatistics());
    return response.data;
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, data }, { dispatch }) => {
    const response = await expenseAPI.updateExpense(id, data);
    // Refresh statistics after updating expense
    dispatch(refreshAllStatistics());
    return response.data;
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { dispatch }) => {
    await expenseAPI.deleteExpense(id);
    // Refresh statistics after deleting expense
    dispatch(refreshAllStatistics());
    return id;
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      const newFilters = { page: 1, limit: 10 };

      Object.keys(action.payload).forEach((key) => {
        const value = action.payload[key];
        if (value !== undefined && value !== null && value !== "") {
          newFilters[key] = value;
        }
      });

      state.filters = newFilters;
    },
    clearFilters: (state) => {
      state.filters = { page: 1, limit: 10 };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch expenses
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch expenses";
      })
      // Fetch dashboard expenses
      .addCase(fetchDashboardExpenses.pending, (state) => {
        state.dashboardLoading = true;
      })
      .addCase(fetchDashboardExpenses.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardExpenses = action.payload.data;
      })
      .addCase(fetchDashboardExpenses.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error =
          action.error.message || "Failed to fetch dashboard expenses";
      })
      // Create expense
      .addCase(createExpense.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses.unshift(action.payload.data);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create expense";
      })
      // Update expense
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.data.id
        );
        if (index !== -1) {
          state.expenses[index] = action.payload.data;
        }
      })
      // Delete expense
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload
        );
      });
  },
});

export const { setFilters, clearFilters, clearError } = expenseSlice.actions;
export default expenseSlice.reducer;

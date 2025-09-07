import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { statisticsAPI } from "../../services/api";
import { apiGuards, createGuardKey } from "../../utils/apiGuards";

const initialState = {
  topSpendingDays: [],
  monthlyChanges: [],
  spendingPredictions: [],
  loading: {
    topSpendingDays: false,
    monthlyChanges: false,
    spendingPredictions: false,
  },
  error: null,
};

export const fetchTopSpendingDays = createAsyncThunk(
  "statistics/fetchTopSpendingDays",
  async () => {
    const guardKey = createGuardKey("topSpendingDays");

    if (apiGuards.isCallInProgress(guardKey)) {
      throw new Error("API call already in progress");
    }

    apiGuards.startCall(guardKey);

    try {
      const response = await statisticsAPI.getTopSpendingDays();
      return response.data;
    } finally {
      apiGuards.completeCall(guardKey);
    }
  }
);

export const fetchMonthlyChanges = createAsyncThunk(
  "statistics/fetchMonthlyChanges",
  async () => {
    const guardKey = createGuardKey("monthlyChanges");
    if (apiGuards.isCallInProgress(guardKey)) {
      throw new Error("API call already in progress");
    }

    apiGuards.startCall(guardKey);

    try {
      const response = await statisticsAPI.getMonthlyChanges();
      return response.data;
    } finally {
      apiGuards.completeCall(guardKey);
    }
  }
);

export const fetchSpendingPredictions = createAsyncThunk(
  "statistics/fetchSpendingPredictions",
  async () => {
    const guardKey = createGuardKey("spendingPredictions");

    if (apiGuards.isCallInProgress(guardKey)) {
      throw new Error("API call already in progress");
    }

    apiGuards.startCall(guardKey);

    try {
      const response = await statisticsAPI.getSpendingPredictions();
      return response.data;
    } finally {
      apiGuards.completeCall(guardKey);
    }
  }
);

// Refresh all statistics
export const refreshAllStatistics = createAsyncThunk(
  "statistics/refreshAllStatistics",
  async (_, { dispatch }) => {
    await Promise.all([
      dispatch(fetchTopSpendingDays()),
      dispatch(fetchMonthlyChanges()),
      dispatch(fetchSpendingPredictions()),
    ]);
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Top spending days
      .addCase(fetchTopSpendingDays.pending, (state) => {
        state.loading.topSpendingDays = true;
        state.error = null;
      })
      .addCase(fetchTopSpendingDays.fulfilled, (state, action) => {
        state.loading.topSpendingDays = false;
        state.topSpendingDays = action.payload.data;
      })
      .addCase(fetchTopSpendingDays.rejected, (state, action) => {
        state.loading.topSpendingDays = false;
        state.error =
          action.error.message || "Failed to fetch top spending days";
      })
      // Monthly changes
      .addCase(fetchMonthlyChanges.pending, (state) => {
        state.loading.monthlyChanges = true;
        state.error = null;
      })
      .addCase(fetchMonthlyChanges.fulfilled, (state, action) => {
        state.loading.monthlyChanges = false;
        state.monthlyChanges = action.payload.data;
      })
      .addCase(fetchMonthlyChanges.rejected, (state, action) => {
        state.loading.monthlyChanges = false;
        state.error = action.error.message || "Failed to fetch monthly changes";
      })
      // Spending predictions
      .addCase(fetchSpendingPredictions.pending, (state) => {
        state.loading.spendingPredictions = true;
        state.error = null;
      })
      .addCase(fetchSpendingPredictions.fulfilled, (state, action) => {
        state.loading.spendingPredictions = false;
        state.spendingPredictions = action.payload.data;
      })
      .addCase(fetchSpendingPredictions.rejected, (state, action) => {
        state.loading.spendingPredictions = false;
        state.error =
          action.error.message || "Failed to fetch spending predictions";
      });
  },
});

export const { clearError } = statisticsSlice.actions;
export default statisticsSlice.reducer;

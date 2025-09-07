import { configureStore } from "@reduxjs/toolkit";
import expenseReducer from "./slices/expenseSlice";
import statisticsReducer from "./slices/statisticsSlice";
import toastReducer from "./slices/toastSlice";
import uiReducer from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    expenses: expenseReducer,
    statistics: statisticsReducer,
    ui: uiReducer,
    toast: toastReducer,
  },
});

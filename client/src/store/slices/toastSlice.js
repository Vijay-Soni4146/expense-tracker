import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action) => {
      const toast = {
        id: Date.now() + Math.random(),
        type: action.payload.type,
        title: action.payload.title,
        message: action.payload.message,
        duration: action.payload.duration || 5000,
        timestamp: Date.now(),
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter(
        (toast) => toast.id !== action.payload
      );
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export const showSuccessToast = (title, message, duration) => (dispatch) => {
  dispatch(addToast({ type: "success", title, message, duration }));
};

export const showErrorToast = (title, message, duration) => (dispatch) => {
  dispatch(addToast({ type: "error", title, message, duration }));
};

export const showInfoToast = (title, message, duration) => (dispatch) => {
  dispatch(addToast({ type: "info", title, message, duration }));
};

export const showWarningToast = (title, message, duration) => (dispatch) => {
  dispatch(addToast({ type: "warning", title, message, duration }));
};

export default toastSlice.reducer;

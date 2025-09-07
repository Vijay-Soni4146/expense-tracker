import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showExpenseForm: false,
  editingExpense: null,
  sidebarOpen: false,
  showDeleteModal: false,
  deletingExpense: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setShowExpenseForm: (state, action) => {
      state.showExpenseForm = action.payload;
      if (!action.payload) {
        state.editingExpense = null;
      }
    },
    setEditingExpense: (state, action) => {
      state.editingExpense = action.payload;
      state.showExpenseForm = action.payload !== null;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setShowDeleteModal: (state, action) => {
      state.showDeleteModal = action.payload;
      if (!action.payload) {
        state.deletingExpense = null;
      }
    },
    setDeletingExpense: (state, action) => {
      state.deletingExpense = action.payload;
      state.showDeleteModal = action.payload !== null;
    },
  },
});

export const {
  setShowExpenseForm,
  setEditingExpense,
  setSidebarOpen,
  setShowDeleteModal,
  setDeletingExpense,
} = uiSlice.actions;
export default uiSlice.reducer;

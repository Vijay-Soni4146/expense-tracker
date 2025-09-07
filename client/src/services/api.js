import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Expense API
export const expenseAPI = {
  getExpenses: (filters = {}) => api.get("/expenses", { params: filters }),
  createExpense: (data) => api.post("/expenses", data),
  updateExpense: (id, data) => api.put(`/expenses/${id}`, data),
  deleteExpense: (id) => api.delete(`/expenses/${id}`),
};

// Statistics API
export const statisticsAPI = {
  getTopSpendingDays: () => api.get("/statistics/top-spending-days"),
  getMonthlyChanges: () => api.get("/statistics/monthly-change"),
  getSpendingPredictions: () => api.get("/statistics/spending-prediction"),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get("/users"),
};

// Categories API
export const categoriesAPI = {
  getCategories: () => api.get("/categories"),
};

export default api;

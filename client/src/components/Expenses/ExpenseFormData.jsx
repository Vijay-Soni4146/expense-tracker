import { useUsers, useCategories } from "../../hooks/useApi";
const ExpenseFormData = () => {
  useUsers();
  useCategories();
  return null; // This component doesn't render anything, just loads data
};

export default ExpenseFormData;

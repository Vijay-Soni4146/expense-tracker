import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import Header from "./components/Layout/Header";
import { store } from "./store/store";
import ExpenseForm from "./components/Expenses/ExpenseForm";
import ExpenseFormData from "./components/Expenses/ExpenseFormData";
import ToastContainer from "./components/UI/Toast";
import AppRoutes from "./routes";

const AppContent = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <div className="flex">
          <main className="flex-1 lg:ml-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AppRoutes />
            </div>
          </main>
        </div>
        <ExpenseFormData />
        <ExpenseForm />
        <ToastContainer />
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import SignupLogin from "./components/SignupLogin";
import Dashboard from './components/Dashboard';
import TaskList from './components/Tasklist';
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isLogin } = useSelector((state) => state.user);
  return isLogin ? children : <Navigate to="/" replace />;
};

function App() {
  const { isLogin } = useSelector((state) => state.user);
  

  return (
    <BrowserRouter>

      <Navbar />
      <Routes>
        <Route path="/" element={isLogin ? <Navigate to="/dashboard" replace /> : <SignupLogin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


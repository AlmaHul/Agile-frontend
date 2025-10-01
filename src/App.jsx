import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";

function App() {
  return (
    <>
      <Header /> {/* Header syns på alla sidor */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}



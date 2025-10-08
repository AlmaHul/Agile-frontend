import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";  // Denna importeras
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";  // Denna importeras
import CreateAvatarPage from "./pages/CreateAvatarPage";
import UpdateAvatarPage from "./pages/UpdateAvatarPage";

function App() {
  return (
    <>
      <Header /> {/* Header syns på alla sidor */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />  {/* Ändra till LoginPage */}
        <Route path="/register" element={<RegisterPage />} />  {/* Ändra till RegisterPage */}
        <Route path="/create-avatar" element={<CreateAvatarPage />} />
        <Route path="/update-avatar" element={<UpdateAvatarPage />} />
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

export default App;
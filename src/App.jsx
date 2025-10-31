import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // 👈 Footer här
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import CreateAvatarPage from "./pages/CreateAvatarPage";
import UpdateAvatarPage from "./pages/UpdateAvatarPage";
import CreateChallengePage from "./pages/CreateChallengePage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UpdateChallengePage from "./pages/UpdateChallengePage";
import AllChallengesPage from "./pages/AllChallengesPage";
import UserProfilePage from "./pages/UserProfilePage";
import AboutUs from "./pages/AboutUs.jsx";
import Footer from "./components/Footer.jsx"; // lägg gärna till .jsx här också


function App() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* HEADER - syns på alla sidor */}
      <Header />

      {/* ROUTES - alla sidor i appen */}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* Öppna sidor */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Skyddade sidor – kräver inloggning */}
          <Route
            path="/create-avatar"
            element={
              <ProtectedRoute>
                <CreateAvatarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-avatar"
            element={
              <ProtectedRoute>
                <UpdateAvatarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-challenge"
            element={
              <ProtectedRoute>
                <CreateChallengePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-challenge/:challengeId"
            element={
              <ProtectedRoute>
                <UpdateChallengePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/all-challenges"
            element={
              <ProtectedRoute>
                <AllChallengesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/:userId"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Publik sida */}
          <Route path="/about" element={<AboutUs />} />

          {/* 404-sida */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </div>

      {/* FOOTER - syns på alla sidor */}
      <Footer />
    </div>
  );
}

export default App;

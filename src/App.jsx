import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/authPage";
import ProfilePage from "./pages/profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

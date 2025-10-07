import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UsersList from "./pages/UsersList";
import UserPage from "./pages/UserPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/users/new" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  );
}

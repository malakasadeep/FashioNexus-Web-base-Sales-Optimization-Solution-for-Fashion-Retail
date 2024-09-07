// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import the Home component// Import the Dashboard component
import DashboardLayout from "./components/dashboard/DashboardLayout";
import PrivateAdmin from "./components/private/PrivateAdmin";
import AddOffer from "./components/discount&offer/AddOffer";

export default function App() {
  return (
    // Single BrowserRouter wrapping the entire application
    <BrowserRouter>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Dashboard Route */}
        <Route element={<PrivateAdmin />}>
          <Route path="/manager/*" element={<DashboardLayout />} />
        </Route>

        {/* Promotion Route */}
        <Route path="/offers/create" element={<AddOffer/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

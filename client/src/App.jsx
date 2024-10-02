// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import the Home component// Import the Dashboard component
import DashboardLayout from "./components/dashboard/DashboardLayout";
import PrivateAdmin from "./components/private/PrivateAdmin";

//dewni
import CreateInventory from "./pages/inventory/CreateInventory";
import InventoryTable from "./components/inventory/InventoryTable";
import UpdateInventory from "./pages/inventory/UpdateInventory";
import DeleteInventory from "./pages/inventory/DeleteInventory";

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
          <Route path="/update/:id*" element={<UpdateInventory />} />
          <Route path="/update/:id*" element={<DeleteInventory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

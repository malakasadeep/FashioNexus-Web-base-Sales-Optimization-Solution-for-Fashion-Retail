import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

//dewni
import CreateInventory from "./pages/inventory/CreateInventory";
import InventoryTable from "./components/inventory/InventoryTable";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/inventories/create" element={<CreateInventory />} />
        <Route path="/admin/inventories" element={<InventoryTable />} />
      </Routes>
    </BrowserRouter>
  );
}

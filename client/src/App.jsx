// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home"; // Import the Home component// Import the Dashboard component
import DashboardLayout from "./components/dashboard/DashboardLayout";
import PrivateAdmin from "./components/private/PrivateAdmin";
import FashionItem from "./pages/order/FashionItem";
import Cart from "./pages/order/Cart";
import Checkout from "./pages/order/Checkout";
import MyOrders from "./pages/order/Myorders";
import Profile from "./pages/Profile";
import PrivateCus from "./components/private/PrivateCus";

//dewni
import CreateInventory from "./pages/inventory/CreateInventory";
import InventoryTable from "./components/inventory/InventoryTable";
import UpdateInventory from "./pages/inventory/UpdateInventory";
import DeleteInventory from "./pages/inventory/DeleteInventory";

//Shadini
import AddOffer from "./components/discount&offer/AddOffer";
import UpdateOffer from "./components/discount&offer/UpdateOffer";
import DeleteOffer from "./components/discount&offer/deleteOffer";

//Shadini
import AddOffer from "./components/discount&offer/AddOffer";
import UpdateOffer from "./components/discount&offer/UpdateOffer";
import DeleteOffer from "./components/discount&offer/deleteOffer";

export default function App() {
  return (
    // Single BrowserRouter wrapping the entire application
    <BrowserRouter>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<FashionItem />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/checkout" element={<Checkout />} />{" "}
        {/* Dashboard Route */}
        <Route element={<PrivateAdmin />}>
          <Route path="/manager/*" element={<DashboardLayout />} />
          <Route path="/update/:id*" element={<UpdateInventory />} />
          <Route path="/update/:id*" element={<DeleteInventory />} />
        </Route>
        <Route element={<PrivateCus />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Promotion Route */}
        <Route path="/offers/create" element={<AddOffer />}></Route>
        {/* <Route path="/update/:id" element={<UpdateOffer />}></Route> */}
        {/* <Route path="/update/:id* " element={<DeleteOffer />}></Route> */}
      </Routes>
    </BrowserRouter>
  );
}

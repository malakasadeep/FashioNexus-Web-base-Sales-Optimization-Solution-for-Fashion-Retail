import express from "express";

// import {
//   getInventories,
//   getInventory,
//   createInventory,
//   deleteInventory,
//   updateInventory,
//   getInventorySearch,
// } from "../../../controllers/inventory.controller.js";

const router = express.Router();

//GET all inventories
// router.get("/", getInventories);
router.get("/", (req, res) => {
  res.json({ mssg: "GET all inventories" });
});

//GET a single inventory
// router.get("/:id", getInventory);
router.get("/:id", (req, res) => {
  res.json({ mssg: "GET an inventory" });
});

//POST a new inventory
// router.post("/add", createInventory);
router.post("/", (req, res) => {
  res.json({ mssg: "CREATE an inventory" });
});

//DELETE an inventory
// router.delete("/:id", deleteInventory);
router.delete("/:id", (req, res) => {
  res.json({ mssg: "DELETE an inventory" });
});

//UPDATE an inventory
// router.put("/:id", updateInventory);
router.patch("/:id", (req, res) => {
  res.json({ mssg: "UPDATE an inventory" });
});

//SEARCH
// router.get("/search/get", getInventorySearch);

export default router;

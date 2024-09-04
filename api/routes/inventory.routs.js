import express from "express";

import {
  getInventories,
  getInventory,
  createInventory,
  deleteInventory,
  updateInventory,
  getInventorySearch,
} from "../../../controllers/inventory.controller.js";

const router = express.Router();

//GET all inventories
router.get("/", getInventories);

//GET a single inventory
router.get("/:id", getInventory);

//POST a new inventory
router.post("/add", createInventory);

//DELETE a inventory
router.delete("/:id", deleteInventory);

//UPDATE a inventory
router.put("/:id", updateInventory);

//SEARCH
router.get("/search/get", getInventorySearch);

export default router;

import Inventory from "../models/inventory.model.js";
import mongoose from "mongoose";

//GET all inventories
export const getInventories = async (req, res) => {
  const inventories = await Inventory.find({}).sort({ createdAt: -1 });

  res.status(200).json(inventories);
};

//GET a single inventory
export const getInventory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such inventory" });
  }

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    return res.status(404).json({ error: "No such inventory" });
  }

  res.status(200).json(inventory);
};

//create new inventory
export const createInventory = async (req, res, next) => {
  try {
    const addinventory = await Inventory.create(req.body);
    return res.status(201).json(addinventory);
  } catch (error) {
    next(error);
  }
};

//DELETE an inventory
export const deleteInventory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such inventory" });
  }

  const inventory = await Inventory.findOneAndDelete({ _id: id });

  if (!inventory) {
    return res.status(400).json({ error: "No such inventory" });
  }

  res.status(200).json(inventory);
};

//UPDATE an inventory
export const updateInventory = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such inventory" });
  }

  const inventory = await Inventory.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    },
    { new: true }
  );

  if (!inventory) {
    return res.status(400).json({ error: "No such inventory" });
  }

  res.status(200).json(inventory);
};

//search

export const getInventorySearch = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let Category = req.query.Category;
    if (Category === undefined || Category === "all") {
      Category = {
        $in: [
          "Men's Clothing",
          "Women's Clothing",
          "Kids' Clothing",
          "Accessories",
          "Footwear",
        ],
      };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const events = await Inventory.find({
      ItemName: { $regex: searchTerm, $options: "i" },
      Category,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(events);
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

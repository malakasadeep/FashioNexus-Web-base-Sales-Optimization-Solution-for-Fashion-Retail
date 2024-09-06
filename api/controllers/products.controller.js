import Products from "../models/products.model.js";

export const addProduct = async (req, res) => {
  try {
    const product = new Products(req.body);
    await product.save();
    res.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add product", error: error.message });
  }
};

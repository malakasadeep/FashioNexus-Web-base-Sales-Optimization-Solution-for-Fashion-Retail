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

// Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Products.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

// Update a product (Additional feature if needed)
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const product = await Products.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

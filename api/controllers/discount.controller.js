import Discount from "../models/discount.model.js";

export const createDiscount = async (req, res) => {
  try {
    const {
      id,
      itemId,
      title,
      rate,
      period,
      conditions,
      description,
      finalPrice,
      actualprice,
    } = req.body;

    const newDiscount = new Discount({
      id,
      itemId,
      title,
      rate,
      period,
      conditions,
      description,
      finalPrice,
      actualprice,
    });

    await newDiscount.save();
    res
      .status(201)
      .json({ message: "Discount created successfully", newDiscount });
  } catch (error) {
    res.status(500).json({ message: "Failed to create discount", error });
  }
};

export const getDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve discounts", error });
  }
};
export const updateDiscounts = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      rate,
      period,
      conditions,
      description,
      finalPrice,
      actualprice,
    } = req.body;

    // Validate if the required fields are present
    if (
      !id ||
      !title ||
      !rate ||
      !period ||
      !conditions ||
      !description ||
      finalPrice === undefined ||
      actualprice === undefined
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Update the discount
    const updatedDiscount = await Discount.findByIdAndUpdate(
      id,
      {
        title,
        rate,
        period,
        conditions,
        description,
        finalPrice,
        actualprice,
      },
      { new: true, runValidators: true } // Ensure validation is run during update
    );

    // Check if discount was found and updated
    if (!updatedDiscount) {
      console.log("Error: Discount not found"); // Log not found error
      return res.status(404).json({ message: "Discount not found" });
    }

    // Return the updated discount
    res.json(updatedDiscount);
  } catch (error) {
    console.error("Error updating discount:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: error.message }); // Provide error message for debugging
  }
};

export const deleteDiscounts = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDiscount = await Discount.findByIdAndDelete(id);

    if (!deletedDiscount) {
      return res.status(404).json({ message: "Discount not found" });
    }

    res.json({ message: "Discount deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

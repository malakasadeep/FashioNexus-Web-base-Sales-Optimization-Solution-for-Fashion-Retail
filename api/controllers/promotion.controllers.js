import Promotion from "../models/promotion.model.js";
import mongoose from "mongoose";

//get all promotions
export const getPromotions = async (req, res) => {
  const promotion = await Promotion.find({}).sort({ createdAt: -1 });

  res.status(200).json(promotion);
};

//get a single promotion
export const getPromotion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such promotion" });
  }

  const promotion = await Promotion.findById(id);

  if (!promotion) {
    return res.status(404).json({ error: "No such promotion" });
  }

  res.status(200).json(promotion);
};

//create new promotion
export const createPromotion = async (req, res) => {
  const {
    promotionName,
    promotionCode,
    description,
    promotionType,
    discountPercentage,
    price,
    finalPrice,
    startDate,
    endDate,
    applicableProducts,
    usageLimit,
    itemId, // Add itemId here
    itemName, // Add itemName here
  } = req.body;

  if (!itemId || !itemName) {
    return res.status(400).json({ error: "itemId and itemName are required." });
  }

  //add doc to db
  try {
    const promotion = await Promotion.create({
      promotionName,
      promotionCode,
      description,
      promotionType,
      discountPercentage,
      price,
      finalPrice,
      startDate,
      endDate,
      applicableProducts,
      usageLimit,
      itemId, // Include itemId in the creation
      itemName, // Include itemName in the creation
    });
    res.status(200).json(promotion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//delete a promotion
export const deletePromotion = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such promotion" });
  }

  const promotion = await Promotion.findOneAndDelete({ _id: id });

  if (!promotion) {
    return res.status(404).json({ error: "No such promotion" });
  }

  res.status(200).json(promotion);
};

//update a promotion

export const updatePromotion = async (req, res) => {
  const { id } = req.params;
  const { promotionName } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such promotion" });
  }

  // Find promotion by id and name
  const promotion = await Promotion.findOne({
    _id: id,
    promotionName: promotionName,
  });

  if (!promotion) {
    return res
      .status(404)
      .json({ error: "No promotion found with the given ID and name" });
  }

  // Proceed with the update if found
  const updatedPromotion = await Promotion.findOneAndUpdate(
    { _id: id, promotionName: promotionName },
    { ...req.body },
    { new: true }
  );

  if (!updatedPromotion) {
    return res.status(404).json({ error: "Failed to update promotion" });
  }

  res.status(200).json(updatedPromotion);
};

export const getPromotionSearch = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = parseInt(req.query.startIndex) || 0;

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = {
        $in: ["pDiscount", "BOGO", "fShipping", "fGift"],
      };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const promos = await Promotion.find({
      promotionName: { $regex: searchTerm, $options: "i" },
      promotionType: type,
    })
      .sort({ [sort]: order })
      .skip(startIndex)
      .limit(limit);

    return res.status(200).json(promos);
  } catch (error) {
    console.log("err", error);
    next(error);
  }
};

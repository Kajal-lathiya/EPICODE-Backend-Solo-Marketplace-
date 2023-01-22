import mongoose from "mongoose";
import ReviewScheme from "../reviews/model.js";
const { Schema, model } = mongoose;

const productScheme = new Schema(
  {
    name: { type: String, required: true }, //REQUIRED
    description: { type: String, required: true }, //REQUIRED
    brand: { type: String, required: true }, //REQUIRED
    imageUrl: { type: String, required: true }, //REQUIRED
    price: { type: Number, required: true }, //REQUIRED
    category: { type: String, required: true },
    reviews: [ReviewScheme]
  },
  { timestamps: true }
);

export default model('Product', productScheme);

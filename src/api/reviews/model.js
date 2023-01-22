import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: { type: String, required: true }, //REQUIRED
  rate: { type: Number, required: true } //REQUIRED, max 5
});

export default reviewSchema;

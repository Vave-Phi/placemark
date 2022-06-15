import mongoose from "mongoose";

const { Schema } = mongoose;

const poiSchema = new Schema({
  name: String,
  desc: String,
  category: String,
  lat: Number,
  lng: Number,
  visitedAmount: Number,
  gallery: {
    type: [String],
    default: [],
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Poi = mongoose.model("Poi", poiSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const poiSchema = new Schema({
  name: String,
  desc: String,
  category: String,
  lat: Number,
  lng: Number,
  visitedAmount: Number,
  img: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Poi = mongoose.model("Poi", poiSchema);

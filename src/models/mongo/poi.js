import mongoose from "mongoose";

const { Schema } = mongoose;

const poiSchema = new Schema({
  name: String,
  desc: String,
  category: String,
  lat: Number,
  lng: Number,
});

export const Poi = mongoose.model("Poi", poiSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;

const poiSchema = new Schema({
  name: String,
  desc: String,
  category: String,
  lat: Number,
  lng: Number,
  img: String,
});

export const Poi = mongoose.model("Poi", poiSchema);

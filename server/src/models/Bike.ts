import mongoose, { Schema } from "mongoose";

const bikeSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["city", "mountainbike", "e-bike"],
    required: true,
  },
  frameSize: {
    type: String,
    required: true,
  },
  batteryLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },
  status: {
    type: String,
    enum: ["available", "rented"],
    default: "available",
  },
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "Station",
    required: true,
  },
  rowNumber: {
    type: Number,
    default: null,
  },
});

export const Bike = mongoose.model("Bike", bikeSchema);
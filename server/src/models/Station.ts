import mongoose, { Schema } from "mongoose";

const stationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rows: [
    {
      number: { type: Number, required: true },
      capacity: { type: Number, required: true, min: 1 },
      occupiedCount: { type: Number, required: true, min: 0, default: 0 },
    },
  ],
});

export const Station = mongoose.model("Station", stationSchema);

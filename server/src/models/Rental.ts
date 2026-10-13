import mongoose, { Schema } from "mongoose";

const rentalSchema = new Schema(
  {
    bikeId: {
      type: Schema.Types.ObjectId,
      ref: "Bike",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    rentedAt: {
      type: Date,
      default: Date.now,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

rentalSchema.index(
  { bikeId: 1 },
  {
    unique: true,
    partialFilterExpression: { returnedAt: null },
  },
);

export const Rental = mongoose.model("Rental", rentalSchema);
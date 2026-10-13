import { Router } from "express";
import mongoose from "mongoose";
import { Bike } from "../../models/Bike.ts";
import { Rental } from "../../models/Rental.ts";
import { Station } from "../../models/Station.ts";
import returnRoutes from "./return.ts";

const router = Router();
router.use(returnRoutes);

router.get("/", async (req, res) => {
  try {
    const rentals = await Rental.find({ returnedAt: null })
      .populate("bikeId")
      .sort({ rentedAt: -1 })
      .lean();
    return res.json(rentals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch rentals" });
  }
});

router.post("/", async (req, res) => {
  const { bikeId, customerName } = req.body ?? {};

  if (typeof bikeId !== "string" || !mongoose.isObjectIdOrHexString(bikeId)) {
    return res.status(400).json({ message: "Valid bikeId is required" });
  }
  if (typeof customerName !== "string" || !customerName.trim()) {
    return res.status(400).json({ message: "Customer name is required" });
  }

  try {
    const rental = await mongoose.connection.transaction(async (session) => {
      const bike = await Bike.findOneAndUpdate(
        {
          _id: bikeId,
          status: "available",
          $or: [{ type: { $ne: "e-bike" } }, { batteryLevel: { $gte: 20 } }],
        },
        {
          $set: {
            status: "rented",
            rowNumber: null,
          },
        },
        { session },
      );

      if (!bike) {
        throw new Error("BIKE_NOT_AVAILABLE");
      }

      const released = await Station.updateOne(
        { _id: bike.stationId, rows: { $elemMatch: { number: bike.rowNumber, occupiedCount: { $gt: 0 } } } },
        { $inc: { "rows.$.occupiedCount": -1 } },
        { session },
      );
      
      if (!released.modifiedCount) throw new Error("Invalid station occupancy");

      const [createdRental] = await Rental.create(
        [
          {
            bikeId,
            customerName: customerName.trim(),
          },
        ],
        { session },
      );

      return createdRental;
    });

    return res.status(201).json(rental);
  } catch (error) {
    if (error instanceof Error && error.message === "BIKE_NOT_AVAILABLE") {
      const bike = await Bike.findById(bikeId).lean();

      if (!bike) {
        return res.status(404).json({ message: "Bike not found" });
      }

      if (bike.status === "rented") {
        return res.status(409).json({ message: "Bike is already rented" });
      }

      if (bike.type === "e-bike" && (bike.batteryLevel ?? 0) < 20) {
        return res.status(409).json({
          message: "E-bike battery must be at least 20%",
        });
      }

      return res.status(409).json({ message: "Bike is not available" });
    }

    if (
      error instanceof mongoose.mongo.MongoServerError &&
      error.code === 11000
    ) {
      return res.status(409).json({
        message: "Bike is already rented",
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Failed to create rental" });
  }
});

export default router;

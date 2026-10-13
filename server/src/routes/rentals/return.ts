import { Router } from "express";
import mongoose from "mongoose";
import { Bike } from "../../models/Bike.ts";
import { Rental } from "../../models/Rental.ts";
import { Station } from "../../models/Station.ts";

const router = Router();

router.post("/:id/return", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ message: "Valid rental ID is required" });
  }

  try {
    const returned = await mongoose.connection.transaction(async (session) => {
      const rental = await Rental.findById(id).session(session);

      if (!rental) throw new Error("RENTAL_NOT_FOUND");

      if (rental.returnedAt) throw new Error("ALREADY_RETURNED");

      const bike = await Bike.findById(rental.bikeId).session(session);
      
      if (!bike || bike.status !== "rented")
        throw new Error("Invalid rental bike");

      const station = await Station.findById(bike.stationId).session(session);
      const row = station?.rows.find((row) => row.occupiedCount < row.capacity);

      if (!row) throw new Error("NO_FREE_SPACE");

      const reserved = await Station.updateOne(
        {
          _id: bike.stationId,
          rows: {
            $elemMatch: { _id: row._id, occupiedCount: { $lt: row.capacity } },
          },
        },
        { $inc: { "rows.$.occupiedCount": 1 } },
        { session },
      );

      if (!reserved.modifiedCount) throw new Error("NO_FREE_SPACE");

      bike.status = "available";
      bike.rowNumber = row.number;
      rental.returnedAt = new Date();

      await bike.save({ session });
      await rental.save({ session });
      return rental;
    });

    return res.status(200).json(returned);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "RENTAL_NOT_FOUND") {
        return res.status(404).json({ message: "Rental not found" });
      }
      if (error.message === "ALREADY_RETURNED") {
        return res.status(409).json({ message: "Rental is already returned" });
      }
      if (error.message === "NO_FREE_SPACE") {
        return res.status(409).json({ message: "No free space at station" });
      }
    }

    console.error(error);
    return res.status(500).json({ message: "Failed to return bike" });
  }
});

export default router;
